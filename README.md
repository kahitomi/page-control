# page-control
My own angular page control directive

before using, notice below:

It shares its scope to your control scope.

if the ajax url has changed, page_init() can help you set page to 1 and refresh it.

##How to use

in your control:

	$scope.setting = {
			url: "",
			type: "GET",
			data: {},
			success: function(json){},
			error: function(code){}
		}