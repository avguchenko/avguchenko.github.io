(function () {
    var myConnector = tableau.makeConnector();


    myConnector.init = function (initCallback) {
    	tableau.connectionData.tables = ["Booking", "Employee", "Project", "Position", "Department", "ScheduleGroup"]
    	tableau.connectionData.main_url = "https://www.teamdesk.net/secure/api/v2/"
    	tableau.connectionData.select = "select.json"
    	tableau.connectionData.describe = "describe.json"

    	tableau.connectionData.typemap = {
    		"Date" : tableau.dataTypeEnum.datetime,
    		"Time" : tableau.dataTypeEnum.datetime,
    		"Text" : tableau.dataTypeEnum.string,
    		"User" : tableau.dataTypeEnum.string,
    		"Autonumber" : tableau.dataTypeEnum.int,
    		"Numeric" : tableau.dataTypeEnum.float,
    		"Phone" : tableau.dataTypeEnum.string,
    		"Email" : tableau.dataTypeEnum.string,
    		"Checkbox" : tableau.dataTypeEnum.bool
    	}
    	initCallback();
    }

    myConnector.getSchema = function (schemaCallback) {
	    
	    var booking_cols = [
	        //{ id : "@row.id", alias : "teamdesk_id", dataType : tableau.dataTypeEnum.int },
	        { id : "id", dataType : tableau.dataTypeEnum.int },
	        { id : "record_owner", dataType : tableau.dataTypeEnum.string },
	        { id : "updated_at", dataType : tableau.dataTypeEnum.datetime },
	        { id : "date", dataType : tableau.dataTypeEnum.datetime },
	        { id : "employee_id", dataType : tableau.dataTypeEnum.int },
	        { id : "project_id", dataType : tableau.dataTypeEnum.int },
	        { id : "position_id", dataType : tableau.dataTypeEnum.int }
	    ];

	    var employee_cols = [
	        //{ id : "@row.id", alias : "teamdesk_id", dataType : tableau.dataTypeEnum.int },
	        { id : "id", dataType : tableau.dataTypeEnum.int },
	        { id : "SystemID", dataType : tableau.dataTypeEnum.int },
	        { id : "record_owner", dataType : tableau.dataTypeEnum.string },
	        { id : "updated_at", dataType : tableau.dataTypeEnum.datetime },
	        { id : "full_name", dataType : tableau.dataTypeEnum.string },
	        { id : "email", dataType : tableau.dataTypeEnum.string },
	        { id : "cell", dataType : tableau.dataTypeEnum.string },
	        { id : "city", dataType : tableau.dataTypeEnum.string },
	        { id : "state", dataType : tableau.dataTypeEnum.string },
	        { id : "manager_id", dataType : tableau.dataTypeEnum.int },
	        { id : "employment_status_id", dataType : tableau.dataTypeEnum.int },
	        { id : "employment_type_id", dataType : tableau.dataTypeEnum.int },
	        { id : "department_id", dataType : tableau.dataTypeEnum.int },
	        { id : "office_id", dataType : tableau.dataTypeEnum.int },
	        { id : "schedule_group_id", dataType : tableau.dataTypeEnum.int },
	        { id : "title_code", dataType : tableau.dataTypeEnum.string },
	        { id : "latitude", dataType : tableau.dataTypeEnum.float },
	        { id : "longitude", dataType : tableau.dataTypeEnum.float },
	        { id : "ultipro_id", dataType : tableau.dataTypeEnum.int },
	        { id : "openair_id", dataType : tableau.dataTypeEnum.int },
	    ];

	    var project_cols = [
	        //{ id : "@row.id", alias : "teamdesk_id", dataType : tableau.dataTypeEnum.int },
	        { id : "id", dataType : tableau.dataTypeEnum.int },
	        { id : "record_owner", dataType : tableau.dataTypeEnum.string },
	        { id : "updated_at", dataType : tableau.dataTypeEnum.datetime },
	        { id : "billing_code", dataType : tableau.dataTypeEnum.string },
	        { id : "name", dataType : tableau.dataTypeEnum.string },
	        { id : "asignment_type_id", dataType : tableau.dataTypeEnum.int },
	        { id : "assignment_status_id", dataType : tableau.dataTypeEnum.int },
	        { id : "department_id", dataType : tableau.dataTypeEnum.int },
	        { id : "start_date", dataType : tableau.dataTypeEnum.date },
	    ];

	    var position_cols = [
	        //{ id : "@row.id", alias : "teamdesk_id", dataType : tableau.dataTypeEnum.int },
	        { id : "id", dataType : tableau.dataTypeEnum.int },
	        { id : "record_owner", dataType : tableau.dataTypeEnum.string },
	        { id : "updated_at", dataType : tableau.dataTypeEnum.datetime },
	        { id : "name", dataType : tableau.dataTypeEnum.string },
	        { id : "sort_order", dataType : tableau.dataTypeEnum.int },
	        { id : "code", dataType : tableau.dataTypeEnum.string },
	        { id : "location", dataType : tableau.dataTypeEnum.string },
	    ];

		var department_cols = [
	        //{ id : "@row.id", alias : "teamdesk_id", dataType : tableau.dataTypeEnum.int },
	        { id : "id", dataType : tableau.dataTypeEnum.int },
	        { id : "record_owner", dataType : tableau.dataTypeEnum.string },
	        { id : "updated_at", dataType : tableau.dataTypeEnum.datetime },
	        { id : "name", dataType : tableau.dataTypeEnum.string },
	    ];	

	    var schedule_group_cols = [
	    	{ id : "id", dataType : tableau.dataTypeEnum.int },
	        { id : "record_owner", dataType : tableau.dataTypeEnum.string },
	        { id : "updated_at", dataType : tableau.dataTypeEnum.datetime },
	        { id : "name", dataType : tableau.dataTypeEnum.string },
	    ];    

	    var bookings_tbl = {
	        id : "bookings",
	        alias : "Booking",
	        columns : booking_cols,
	        incrementColumnId : "updated_at"
	    };

	    var employees_tbl = {
	        id : "employees",
	        alias : "Employee",
	        columns : employee_cols,
	        incrementColumnId : "updated_at"
	    };

	    var projects_tbl = {
	        id : "projects",
	        alias : "Project",
	        columns : project_cols,
	        incrementColumnId : "updated_at"
	    };

	    var positions_tbl = {
	        id : "positions",
	        alias : "Position",
	        columns : position_cols,
	    };

	    var departments_tbl = {
	        id : "departments",
	        alias : "Department",
	        columns : department_cols,
	    };

	    var schedule_groups_tbl = {
	        id : "schedule_groups",
	        alias : "ScheduleGroup",
	        columns : schedule_group_cols,
	    };

	    var bookingsConnection = {
		    "alias": "Bookings Connection",
		    "tables": [{
		        "id": "bookings",
		        "alias": "Bookings"
		    }, {
		        "id": "employees",
		        "alias": "Employees"
		    }, {
		        "id": "employees",
		        "alias": "Managers"
		    }, {
		        "id": "projects",
		        "alias": "Projects"
		    }, {
		        "id": "positions",
		        "alias": "Positions"
		    }, {
		        "id": "departments",
		        "alias": "Departments"
		    }, {
		        "id": "schedule_groups",
		        "alias": "Schedule Groups"
		    }],

		    "joins": [{
		        "left": {
		            "tableAlias": "Bookings",
		            "columnId": "employee_id"
		        },
		        "right": {
		            "tableAlias": "Employees",
		            "columnId": "id"
		        },
		        "joinType": "left"
		    }, {
		        "left": {
		            "tableAlias": "Employees",
		            "columnId": "department_id"
		        },
		        "right": {
		            "tableAlias": "Departments",
		            "columnId": "id"
		        },
		        "joinType": "left"
		    }, {
		        "left": {
		            "tableAlias": "Bookings",
		            "columnId": "position_id"
		        },
		        "right": {
		            "tableAlias": "Positions",
		            "columnId": "id"
		        },
		        "joinType": "left"
		    }, {
		        "left": {
		            "tableAlias": "Bookings",
		            "columnId": "project_id"
		        },
		        "right": {
		            "tableAlias": "Projects",
		            "columnId": "id"
		        },
		        "joinType": "left"
		    }, {
		        "left": {
		            "tableAlias": "Employees",
		            "columnId": "manager_id"
		        },
		        "right": {
		            "tableAlias": "Managers",
		            "columnId": "id"
		        },
		        "joinType": "left"
		    },  {
		        "left": {
		            "tableAlias": "Employees",
		            "columnId": "schedule_group_id"
		        },
		        "right": {
		            "tableAlias": "Schedule Groups",
		            "columnId": "id"
		        },
		        "joinType": "left"
		    },



		    ]
		};

	    schemaCallback([bookings_tbl, employees_tbl, projects_tbl, positions_tbl, departments_tbl, schedule_groups_tbl], [bookingsConnection]);
	};

    myConnector.getData = function(table, doneCallback) {
		var minDate;
		var records_received = 0;

		if (table.tableInfo.id == "bookings") {
			minDate = moment(tableau.connectionData.minDate);
			console.log({ tableau_connectionData_mindate: tableau.connectionData.minDate })
			console.log({ minDate: minDate })
		} else {
			minDate = moment().year(2000).month(1).day(1);
		}
		var cursor = 0;
    	getDataHelper(table, minDate, cursor, records_received, doneCallback)
    }

    getDataHelper = function(table, minDate, cursor, records_received, cb) {
    	console.log({table: table})
    	var tbl_name_api = table.tableInfo.alias;
    	var main_url = "https://www.teamdesk.net/secure/api/v2/18890"
    	var select = "select.json"
    	
    	var sort_clause = "sort=Date Created//ASC"
    	var sort_url = encodeURI(sort_clause).replace(new RegExp('/', 'g'), '%2F');

    	var filter_clause = "filter=[Date Created] > #" + minDate.format("YYYY-MM-DD HH:mm:ss") + "# and ToNumber([Id]) > " + cursor
    	var filter_url = encodeURI(filter_clause).replace(new RegExp('#', "g"), '%23')
    	
    	//console.log({minDate: minDate})
    	//console.log({filter_clause: filter_clause})
    	//console.log({filter_url: filter_url})
    	
    	var call_url = [main_url, tableau.password, tbl_name_api, select].join("/")

    	//specify the columns for each table to pull from teamdesk 
    	var common_cols = ["Date Modified", "Record Owner", "Id"]

    	if (table.tableInfo.id == "bookings") {
    		var table_cols = ["Date", "Employee", "Project", "Position"]
    	}

    	if (table.tableInfo.id == "employees") {
    		var table_cols = ["SystemID", "Full Name", "Email", "Cell Phone", "Manager", "ScheduleGroup", "EmploymentStatus", "Office", "Department", "EmploymentType", "ActvityID", "latitude", "longitude", "UltiproID", "OpenAirID", "city", "state"]
    		//"column=SystemID&column=Full%20Name&column=Email&column=Cell%20Phone&column=Manager&column=ScheduleGroup&column=EmploymentStatus
    		//&column=Office&column=Department&column=EmploymentType&column=ActvityID&column=latitude&column=longitude&column=UltiproID&column=city&column=state&column=OpenAirID"
    	}

		if (table.tableInfo.id == "projects") {
    		var table_cols = ""
    	}

    	if (table.tableInfo.id == "positions") {
    		var table_cols = ""
    	}  

    	if (table.tableInfo.id == "departments") {
    		var table_cols = ""
    	}

    	if (table.tableInfo.id == "schedule_groups") {
    		var table_cols = ""
    	}

    	table_cols.push.apply(table_cols, common_cols)
    	var columns_url = "column=" + table_cols.join("&column=")

		var tableData = [];
		var final_url = call_url + "?" + columns_url + "&" + sort_url + "&" + filter_url;
		//console.log({ final_url: final_url })
		console.log({ cursor: cursor });
		$.getJSON(final_url, function(resp) {
			var feat = resp;
            var i = 0;
         
            if (table.tableInfo.id == "bookings") {
				for (i = 0, len = feat.length; i < len; i++) {
					tableData.push({
						"id": parseInt(feat[i].Id),
        				"record_owner": feat[i]["Record Owner"],
        				"date": new Date(feat[i].Date),
        				"updated_at": new Date(feat[i]["Date Modified"]),
        				"employee_id": parseInt(feat[i].Employee),
        				"project_id": parseInt(feat[i].Project),
        				"position_id": parseInt(feat[i].Position),
					});
					cursor = feat[i].Id
				}
			}

			if (table.tableInfo.id == "employees") {
				for (i = 0, len = feat.length; i < len; i++) {
					tableData.push({
						"id": parseInt(feat[i].Id),
						"SystemID": parseInt(feat[i].SystemID),
        				"record_owner": feat[i]["Record Owner"],
        				"updated_at": new Date(feat[i]["Date Modified"]),
        				"full_name": feat[i]["Full Name"],
        				"email": feat[i].Email,
        				"cell": feat[i]["Cell Phone"],
        				"city": feat[i].city,
        				"state": feat[i].state,
        				"manager_id": parseInt(feat[i].Manager),
        				"employment_status_id": parseInt(feat[i]["EmploymentStatus"]),
        				"employment_type_id": parseInt(feat[i]["EmploymentType"]),
        				"department_id": parseInt(feat[i].Department),
        				"office_id": parseInt(feat[i].Office),
        				"schedule_group_id": parseInt(feat[i].ScheduleGroup),
        				"title_code": feat[i].ActvityID,
        				"latitude": feat[i].latitude,
        				"longitude": feat[i].longitude,
        				"ultipro_id": parseInt(feat[i].UltiproID),
        				"openair_id": parseInt(feat[i].OpenAirID)
					});
					cursor = feat[i].Id
				}
			}

			table.appendRows(tableData);
			
			records_received = records_received + tableData.length
			var msg = "Imported " + records_received + " " + table.tableInfo.id
			tableau.reportProgress(msg);
			console.log(msg)

			if(tableData.length < 500) {
				console.log('Ending fetching data ' + cursor);
				cb();	
			} else {
				console.log('Continue fetching data ' + cursor)
				getDataHelper(table, minDate, cursor, records_received, cb);
			}
		}); //getJSON call
	}; // end getDataHelper

    tableau.registerConnector(myConnector);
    $(document).ready(function () {
    $("#submitButton").click(function () {
        tableau.connectionName = "TeamDesk Bookings";

        // alert( $("#startDate").val())
        tableau.connectionData = {}
        tableau.connectionData.minDate = $("#startDate").val()
        tableau.connectionData.appId = $("#appId").val()
        tableau.password = $("#token").val()
        
        tableau.submit();
    });
});
})();