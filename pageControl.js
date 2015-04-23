//分页插件
.directive('pageControl', function($parse){
	return {
    	// scope: {
    	// 	range: "=",
    	// 	setting: "="
    	// },
    	// transclude: true,
		link: function(scope, element, attr){
			if(!scope.setting.url){
				scope.setting.url = "";
			}
			if(!scope.setting.type){
				scope.setting.type = "GET";
			}
			if(!scope.setting.data){
				scope.setting.data = {};
			}
			if(!scope.setting.success){
				scope.setting.success = function(){};
			}
			if(!scope.setting.error){
				scope.setting.error = function(){};
			}

			if(attr.noArrow){
				element.addClass("no-arrow");
			}

			scope.page_number_range = attr.range | 2;				//页面列表显示范围
			scope.current_number = 1;								//当前页
			scope.page_numbers = [1];								//页面列表
			scope.last_page_number = 1;								//总页数
			scope.last_page_number_string = scope.last_page_number;	//显示总页数的字符串 ...233
			scope.last_page_number_show = false;					//是否显示最后一个快捷链接
			scope.turn_to = function(page_number){
				if(page_number<1 || page_number>scope.last_page_number){
					return false;
				}

				scope.setting.data.pageNo = page_number;

				$.http({
					url: scope.setting.url,
					type: scope.setting.type,
					data: scope.setting.data,
					success: function(json){
						// var temp = attr.connect(page_number);
						// scope.current_number = temp[0];
						// scope.last_page_number = temp[1];
						scope.current_number = json.pageNum;
						scope.last_page_number = Math.ceil(json.totalCount/json.pageSize);
						if(json.totalCount == 0){
							scope.last_page_number = 1;
						}

						var start = (scope.current_number-scope.page_number_range)<1?1:scope.current_number-scope.page_number_range,
							end = (scope.current_number+scope.page_number_range)>scope.last_page_number?scope.last_page_number:scope.current_number+scope.page_number_range;
						scope.page_numbers = [];
						// 生成分页数字列表
						while(start<=end){
							scope.page_numbers.push(start);
							start++;
						};
						// 判断最后一页的显示
						if(scope.last_page_number > end){
							scope.last_page_number_show = true;
							if(scope.last_page_number - end == 1){
								scope.last_page_number_string = scope.last_page_number;
							}
							else
							{
								scope.last_page_number_string = "..."+scope.last_page_number;
							}
						}
						else
						{
							scope.last_page_number_show = false;
						}
						scope.setting.success(json);
					},
					error: function(code){
						scope.setting.error(code);
					}
				});

						
			};
			scope.ref_page = function(){
				scope.turn_to(scope.current_number);
			};
			scope.init = function(){
				scope.turn_to(1);
			};
			scope.page_init(1);
			// scope.$watch(scope.setting, function(){
			// 	scope.init(1);
			// })
			// console.log(scope);
		},
		templateUrl: function(elem, attr){
			return 'page-control.html';
		}
	}
})