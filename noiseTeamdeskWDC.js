(function () {
    var myConnector = tableau.makeConnector();

    // Init function for connector, called during every phase
	

    myConnector.getSchema = function (schemaCallback) {
	    var cols = [
	        //{ id : "@row.id", alias : "teamdesk_id", dataType : tableau.dataTypeEnum.int },
	        { id : "Id", alias : "id", dataType : tableau.dataTypeEnum.int },
	        { id : "record_owner", alias : "Record Owner", dataType : tableau.dataTypeEnum.string },
	        { id : "mssql_id", alias : "mssql_id", dataType : tableau.dataTypeEnum.int },
	        { id : "site_name", alias : "Site Name", dataType : tableau.dataTypeEnum.string },
	        { id : "calibration_entity", alias : "Calibration Entity", dataType : tableau.dataTypeEnum.string },
	        { id : "address_street_number", alias : "address_street_number", dataType : tableau.dataTypeEnum.string },
	        { id : "address_street_name", alias : "address_street_name", dataType : tableau.dataTypeEnum.string },
	        { id : "address_city", alias : "address_city", dataType : tableau.dataTypeEnum.string },
	        { id : "address_state", alias : "address_state", dataType : tableau.dataTypeEnum.string },
	        { id : "address_zip", alias : "address_zip", dataType : tableau.dataTypeEnum.int },
	        { id : "latitude", alias : "latitude", columnRole: "dimension", dataType : tableau.dataTypeEnum.float },
	        { id : "longitude", alias : "longitude",columnRole: "dimension", dataType : tableau.dataTypeEnum.float },
	        { id : "SHORT_NAME", alias : "short_name", dataType : tableau.dataTypeEnum.string }
	    ];

	    var tableInfo = {
	        id : "sites_from_personal_samples",
	        alias : "Sites From Personal Samples",
	        columns : cols
	    };

	    schemaCallback([tableInfo]);
	};

    myConnector.getData = function(table, doneCallback) {
    	var teamdesk_url = "https://cteh.dbflex.net/secure/api/v2/51515/" + tableau.password + "/Site/select.json";
	    $.getJSON(teamdesk_url, function(resp) {
	    	console.log("1");
	    	console.log(resp);
	        var feat = resp,
	            tableData = [];
	        console.log("2");

	        // Iterate over the JSON object
	        for (var i = 0, len = feat.length; i < len; i++) {
	            console.log(".");
	            tableData.push({
	                //"@row.id": feat[i].
	                "id": feat[i].Id,
	                "site_name": feat[i].site_name,
	                "address_street_number": feat[i].address_street_number,
	                "address_street_name": feat[i].address_street_name,
	                "address_city": feat[i].address_city,
	                "address_state": feat[i].address_state,
	                "address_zip": feat[i].address_zip,
	                "longitude": feat[i].longitude,
	                "latitude": feat[i].latitude
	            });
	        }
	        console.log("3");
	        console.log(tableData);
	        table.appendRows(tableData);
	        console.log("4");
	        doneCallback();
	        console.log("5");
	    });
	};

    tableau.registerConnector(myConnector);

    $(document).ready(function () {
    $("#submitButton").click(function () {
        tableau.connectionName = "TeamDesk";
        tableau.password = $("#token").val()
        tableau.submit();
    });
});
})();