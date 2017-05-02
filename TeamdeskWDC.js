(function () {
    var myConnector = tableau.makeConnector();
    clean_colname = function(teamdesk_column_name) {
    	teamdesk_column_name = teamdesk_column_name.split('-').join('_')
    	teamdesk_column_name = teamdesk_column_name.split(' ').join('_')
    	teamdesk_column_name = teamdesk_column_name.split(':').join('_')
    	teamdesk_column_name = teamdesk_column_name.split("'").join('_')
    	teamdesk_column_name = teamdesk_column_name.split('#').join('_')
    	teamdesk_column_name = teamdesk_column_name.split('/').join('_')
    	teamdesk_column_name = teamdesk_column_name.split(')').join('_')
    	teamdesk_column_name = teamdesk_column_name.split('(').join('_')
    	teamdesk_column_name = teamdesk_column_name.split(',').join('_').toLowerCase();
    	//replace(new RegExp(/[-\s:'#/()]/g), '_')
    	return teamdesk_column_name
    }

    process_string_list = function(tables_string) {
    	return tables_string.split(/[,]+/).map(function(item) {
			  return item.trim();
			});
    }

    inject_into_tableau = function(connData) {
    	if (tableau.connectionData != "") {
    		var existing_params = JSON.parse(tableau.connectionData)
	    	//...and add in the new things from connData
	    	var all_params = $.extend({}, existing_params, connData); 
	    	//store everything back into tableau.connectionData
	    	tableau.connectionData = JSON.stringify(all_params);
    	} else {
    		tableau.connectionData = JSON.stringify(connData)
    	}
    }

    myConnector.init = function (initCallback) {
    	var connData = {}
    	connData.select = "select.json"
    	connData.describe = "describe.json"
    	connData.sort_clause = "sort=Date Created//ASC"
    	//connData.common_cols = ["Date Modified", "Record Owner", "Id"]

    	connData.typemap = {
    		"Date" : tableau.dataTypeEnum.datetime,
    		"Time" : tableau.dataTypeEnum.datetime,
    		"Timestamp" : tableau.dataTypeEnum.datetime,
    		"Text" : tableau.dataTypeEnum.string,
    		"User" : tableau.dataTypeEnum.string,
    		"Autonumber" : tableau.dataTypeEnum.int,
    		"Numeric" : tableau.dataTypeEnum.float,
    		"Phone" : tableau.dataTypeEnum.string,
    		"Email" : tableau.dataTypeEnum.string,
    		"Checkbox" : tableau.dataTypeEnum.bool
    	}

    	inject_into_tableau(connData);
    	initCallback();
    }

    myConnector.getSchema = function (schemaCallback) {
	    var tbl_index = 0;
	    var wdc_tables = []
    	getSchemaHelper(wdc_tables, tbl_index, schemaCallback);
    }; //end of myConnector.getSchema
    	
    getSchemaHelper = function(wdc_tables, tbl_index, cb) {
		var conn = JSON.parse(tableau.connectionData)
		var describe_url = [conn.main_url, conn.app_id, tableau.password, conn.tables[tbl_index], conn.describe].join("/")
		
		$.getJSON(describe_url, function(resp) {
			var teamdesk_cols = resp.columns
			var wdc_cols = [];
			
			var msg = 'Fetching schema for ' + conn.tables[tbl_index] + 's...'
			tableau.reportProgress(msg);
			tableau.log(msg);
			
			for (var i = 0; i < teamdesk_cols.length; i++) {
				td_column = teamdesk_cols[i]
				if (td_column.kind != "Formula" && td_column.kind != "Lookup") {
					var wdc_alias =  clean_colname(td_column.name);
					var wdc_dataType = conn.typemap[td_column.type] || tableau.dataTypeEnum.string
					if (td_column.reference != undefined) {
						wdc_alias = wdc_alias + "_id"
						//override dataType for references
						wdc_dataType = tableau.dataTypeEnum.int
					}
					wdc_cols.push({ 
						//tebleau does not allow spaces in incoming column names, 
						//so we clean it and store the teamdesk column name in "description"
						id: clean_colname(td_column.name),
						dataType: wdc_dataType,
						description: td_column.name,
						alias: wdc_alias
					})
				}
			}
			wdc_cols_copy = wdc_cols
			//console.log({wdc_cols_copy: wdc_cols_copy})
			wdc_tables.push({
				id : clean_colname(conn.tables[tbl_index]),
		        alias : conn.tables[tbl_index],
		        columns : wdc_cols_copy
			})

			msg = 'Finished fetching schema for ' + conn.tables[tbl_index]
			tableau.reportProgress(msg);
			tableau.log(msg);

			if(wdc_tables.length == conn.tables.length) {
				//Once we're finished, load the full schema into connData for later use
				conn.wdc_tables = wdc_tables;
				tableau.connectionData = JSON.stringify(conn);
				cb(wdc_tables);
			} else {
				tbl_index++;
				getSchemaHelper(wdc_tables, tbl_index, cb);
			}
		}); // getJSON call
    };

    myConnector.getData = function(table, doneCallback) {
		var minDate;
		var records_received = 0;
		var conn = JSON.parse(tableau.connectionData)
		var found = false

		//set up minDate filter for filtered tables
		for (var t = 0; t < conn.filter_tables.length && !found; t++) {
    		if (conn.filter_tables[t] == table.tableInfo.alias) {
    			minDate = moment(conn.minDate);
    			found = true
    		} else {
    			minDate = moment().year(2000).month(1).day(1);
    		}
    	}
		var cursor = 0;
    	getDataHelper(table, minDate, cursor, records_received, doneCallback)
    }

    getDataHelper = function(table, minDate, cursor, records_received, cb) {
    	var conn = JSON.parse(tableau.connectionData)
    	var tbl_name_api = table.tableInfo.alias;
    	var top = 400
    	
    	var filter_clause = "filter=ToNumber([Id]) > " + cursor
    	for (var t = 0; t < conn.filter_tables.length; t++) {
    		if (conn.filter_tables[t] == tbl_name_api) {
    			filter_clause = filter_clause + " and " + "[" + conn.filter_column + "] > #" + minDate.format("YYYY-MM-DD") + "#"
    		}
    	}

    	var sort_url = encodeURI(conn.sort_clause).replace(new RegExp('/', 'g'), '%2F');
    	var filter_url = encodeURI(filter_clause).replace(new RegExp('#', "g"), '%23')
    	var top_url = "top=" + top
    	var wdc_table = conn.wdc_tables.filter(function(e) {
    		return e.alias == table.tableInfo.alias;
    	})[0]

    	var wdc_cols = wdc_table.columns
    	var teamdesk_col_names = []

    	for (var i = 0; i < wdc_cols.length; i++) {
    		teamdesk_col_names.push(wdc_cols[i].description)
    	}

    	var columns_url = encodeURI("column=" + teamdesk_col_names.join("&column=")).replace(new RegExp('/', 'g'), '%2F').replace(new RegExp('#', "g"), '%23');
    	var call_url = [conn.main_url, conn.app_id, tableau.password, tbl_name_api, conn.select].join("/")
    	var final_url = call_url + "?" + columns_url + "&" + sort_url + "&" + top_url + "&" + filter_url;
		var tableData = [];

		$.getJSON(final_url, function(resp) {
			var feat = resp;
            var i = 0;
			for (i = 0, len = feat.length; i < len; i++) {
				var record = {}
				for (var f = 0; f < wdc_cols.length; f++) {
					//now pull the original teamdesk column out of "description"
					var teamdesk_col_name = wdc_cols[f].description
					var alias = wdc_cols[f].alias
					if (wdc_cols[f].dataType == tableau.dataTypeEnum.datetime) {
						record[wdc_cols[f].id] = new Date(feat[i][teamdesk_col_name])
					} else if (wdc_cols[f].dataType == tableau.dataTypeEnum.int) {
						record[wdc_cols[f].id] = parseInt(feat[i][teamdesk_col_name])
					} else if (alias && alias.indexOf("_id") > 0) {
						record[wdc_cols[f].id] = parseInt(feat[i][teamdesk_col_name])
					} else {
						record[wdc_cols[f].id] = feat[i][teamdesk_col_name]
					}
				}
				//console.log(".")
				tableData.push(record);
				cursor = feat[i].Id
			}
			table.appendRows(tableData);
			
			records_received = records_received + tableData.length
			var msg = "Imported " + records_received + " " + table.tableInfo.id + "s"
			tableau.reportProgress(msg);
			console.log(msg)

			if(tableData.length < top) {
				console.log('Finished fetching data at id ' + cursor);
				cb();	
			} else {
				console.log('Continue fetching data from id ' + cursor)
				getDataHelper(table, minDate, cursor, records_received, cb);
			}
		}); //getJSON call
	}; // end getDataHelper

    tableau.registerConnector(myConnector);
    $(document).ready(function () {
    $("#submitButton").click(function () {
        var connData = {}
        // alert( $("#startDate").val())
        connData.minDate = $("#filterValue").val()
        connData.app_id = $("#appId").val()
        connData.tables = process_string_list($("#teamdeskTables").val())
        connData.filter_tables = process_string_list($("#filteredTables").val())
        connData.filter_column = $("#filterField").val()
        connData.main_url = $("#main_url").val()

        inject_into_tableau(connData)
        tableau.connectionName = "TeamDesk " + connData.app_id;
        tableau.password = $("#token").val()
        tableau.submit();
    });
});
})();