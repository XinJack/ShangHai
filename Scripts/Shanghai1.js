

/*
* 万科类，计划将所有与万科有关的功能添加的此类当中
*/
function WankeApp(){
	this.map;
	this.initLayer;
	//由于一次只是显示一个热力图层，因此只用一个变量来存储就可以了
	this.heatmapLayer;
	this.heatmapUrls = {
		SubwayHeatmapUrl:"http://localhost:6080/arcgis/rest/services/热力图/MapServer/0",
		RestaurantUrl:"http://localhost:6080/arcgis/rest/services/热力图/MapServer/1",
	};
	this.isHeatmapShown = {
		isRestaurantShown : false,
		isSubwayMorningOutHeatmapShown:false,
		isSubwayMorningInHeatmapShown:false,
		isSubwayEveningOutHeatmapShown:false,
		isSubwayEveningInHeatmapShown:false,
	};
	this.legends = {
		RestaurantLegend:null,
		SubwayMorningOutLegend:null,
		SubwayMorningInLegend:null,
		SubwayEveningOutLegend:null,
		SubwayEveningInLegend:null,
	};
};

/*
*	初始化
*/
WankeApp.prototype.init = function(mapDivID){
	//用that来保存this指针，以便将this传递到initializeMap静态方法中，从而初始化WankeApp的map属性
	var that = this;

	require(["esri/map", "esri/layers/ArcGISTiledMapServiceLayer", "esri/geometry/Extent","esri/SpatialReference", "esri/layers/FeatureLayer", "esri/renderers/HeatmapRenderer","esri/dijit/Legend","dojo/domReady!"],
		function(Map, ArcGISTiledMapServiceLayer,Extent, SpatialReference, FeatureLayer, HeatmapRenderer, Legend){
			initializeMap(Map, ArcGISTiledMapServiceLayer,Extent, SpatialReference, FeatureLayer, HeatmapRenderer);
			initializeHTML();
			initializeHeatmapLayer(FeatureLayer, HeatmapRenderer,Legend);
	});
	
	/*
	*	初始化地图和底图
	*/
	function initializeMap(Map, ArcGISTiledMapServiceLayer,Extent, SpatialReference, FeatureLayer, HeatmapRenderer){
		that.map = new Map(mapDivID,{Extent: new Extent(120.8599508903131, 31.122347889012865, 122.11833818012421, 31.541810318949906, new SpatialReference(4326)), zoom: 2, center: [121.4791445, 31.1220791]});
		//默认底图图层
		that.initLayer = new ArcGISTiledMapServiceLayer("http://localhost:6080/arcgis/rest/services/万科_上海地图/MapServer");
		that.map.addLayer(that.initLayer);
	}

	/*
	*	初始化页面，主要是地图容器大小和目录树
	*/
	function initializeHTML(){
		//设置地图大小
		setMapSize();
		//浏览器大小调整监听事件，随时调整地图大小
		$(window).on("resize",function(){
			//创建图例的时候会对原本的css属性有所修改，这里需要改回来
			$("div#legendDiv").css("position", "absolute");
			setMapSize();
		});
		//初始化目录树
		$("nav.easy-tree").EasyTree();
		//树结构的显示和隐藏事件
		$("span.controler").on("click", function(){
			if($(this).hasClass("glyphicon-chevron-right")){
				$("nav").css("left", 0);
				$(this).css("left", "25%");
				//将展开图标变成收回图标
				$(this).removeClass("glyphicon-chevron-right").addClass("glyphicon-chevron-left");
			}else{
				$("nav").css("left", "-25%");
				$(this).css("left", 0);
				//将收回图标变成展开图标
				$(this).removeClass("glyphicon-chevron-left").addClass("glyphicon-chevron-right");
			}
		});
		//一开始图例层是隐藏的
		$("div#info").hide();
	}

	/*
	* 设置地图大小填充整个窗口同时设置左侧导航栏的高度为窗口的高度
	*/
	function setMapSize(){
		$("div#mapDiv").css("width", window.innerWidth);
		$("div#mapDiv").css("height", window.innerHeight);
		$("nav").css("height", window.innerHeight);
	}

	/*
	*	初始化热力图，控制每个热力图的显示和关闭
	*/
	function initializeHeatmapLayer(FeatureLayer, HeatmapRenderer, Legend){
		//大众点评餐饮热力图点击事件			
		$("li#restaurantHeatmap a").on("click", function(){
			//由于采用了多个图层来表示图例，且这多个图层的位置相同，因此点击相应的热力图层时需要将相应的图例的z-index值设置为400，其他图层的z-index值设置为0，保证当前热力图图例位于最上面
			$("div.legend").css("z-index","0");
			$("div#restaurantLegendDiv").parent().css("z-index","400");
			//隐藏导航框
			hidePanel();
			toggleHeatmap("isRestaurantShown","RestaurantUrl","cost_for_o", "大众点评餐饮热力图", "restaurantLegendDiv", "RestaurantLegend", FeatureLayer, HeatmapRenderer, Legend);
		});
		//地铁口人流量(早上出发)热力图点击事件
		$("li#subwayMorningOutHeatmap a").on("click", function(){
			//由于采用了多个图层来表示图例，且这多个图层的位置相同，因此点击相应的热力图层时需要将相应的图例的z-index值设置为400，其他图层的z-index值设置为0，保证当前热力图图例位于最上面
			$("div.legend").css("z-index","0");
			$("div#subwayMorningOutLegendDiv").parent().css("z-index","400");
			//隐藏导航框
			hidePanel();
			toggleHeatmap("isSubwayMorningOutHeatmapShown","SubwayHeatmapUrl","o_morning", "地铁人流量（早上出发）", "subwayMorningOutLegendDiv", "SubwayMorningOutLegend", FeatureLayer, HeatmapRenderer, Legend);
		});
		//地铁口人流量(早上到达)热力图点击事件
		 $("li#subwayMorningInHeatmap a").on("click", function(){
		 	//由于采用了多个图层来表示图例，且这多个图层的位置相同，因此点击相应的热力图层时需要将相应的图例的z-index值设置为400，其他图层的z-index值设置为0，保证当前热力图图例位于最上面
		 	$("div.legend").css("z-index","0");
		 	$("div#subwayMorningInLegendDiv").parent().css("z-index","400");
		 	//隐藏导航框
		 	hidePanel();
		 	toggleHeatmap("isSubwayMorningInHeatmapShown","SubwayHeatmapUrl","d_morning", "地铁人流量（早上到达）", "subwayMorningInLegendDiv", "SubwayMorningInLegend", FeatureLayer, HeatmapRenderer, Legend);
		 });
		// //地铁口人流量(晚上出发)热力图点击事件
		 $("li#subwayEveningOutHeatmap a").on("click", function(){
		 	//由于采用了多个图层来表示图例，且这多个图层的位置相同，因此点击相应的热力图层时需要将相应的图例的z-index值设置为400，其他图层的z-index值设置为0，保证当前热力图图例位于最上面
		 	$("div.legend").css("z-index","0");
		 	$("div#subwayEveningOutLegendDiv").parent().css("z-index","400");
		 	//隐藏导航框
		 	hidePanel();
		 	toggleHeatmap("isSubwayEveningOutHeatmapShown","SubwayHeatmapUrl","o_evening", "地铁人流量（晚上出发）", "subwayEveningOutLegendDiv", "SubwayEveningOutLegend", FeatureLayer, HeatmapRenderer, Legend);
		 });
		 //地铁口人流量(晚上到达)热力图点击事件
		 $("li#subwayEveningInHeatmap a").on("click", function(){
		 	//由于采用了多个图层来表示图例，且这多个图层的位置相同，因此点击相应的热力图层时需要将相应的图例的z-index值设置为400，其他图层的z-index值设置为0，保证当前热力图图例位于最上面
		 	$("div.legend").css("z-index","0");
		 	$("div#subwayEveningInLegendDiv").parent().css("z-index","400");
		 	//隐藏导航框
		 	hidePanel();
		 	toggleHeatmap("isSubwayEveningInHeatmapShown","SubwayHeatmapUrl","d_evening", "地铁人流量（晚上到达）", "subwayEveningInLegendDiv", "SubwayEveningInLegend", FeatureLayer, HeatmapRenderer, Legend);
		 });
		
	}

	/*
	*	辅助函数，用来回收面板
	*/
	function hidePanel(){
		$("nav").css("left", "-25%");
		$("span.controler").css("left", 0);
		//将收回图标变成展开图标
		$("span.controler").removeClass("glyphicon-chevron-left").addClass("glyphicon-chevron-right");
	}

	/*
	*	热力图控制按钮的切换功能
	*/
	function toggleHeatmap(isShown, heatmapUrl, fieldStr, title, legendDivId, legendName, FeatureLayer, HeatmapRenderer, Legend){
		//用户直接按了其他热力图时的处理
		if(that.heatmapLayer != null){
			that.map.removeLayer(that.heatmapLayer);
			for(var shown in that.isHeatmapShown){
				if(shown == isShown){
					continue;
				}
				that.isHeatmapShown[shown] = false;
			}
		}
		if(that.isHeatmapShown[isShown]){
			that.map.removeLayer(that.heatmapLayer);
			//将热力图图例隐藏
			$("div.legend").hide("slow");
			that.isHeatmapShown[isShown] = false;
		}else{
			createHeatmapAndLegend(heatmapUrl, fieldStr , title, legendDivId, legendName, FeatureLayer, HeatmapRenderer, Legend);
			//显示热力图图例
			$("div.legend").show("slow");
			that.isHeatmapShown[isShown] = true;
		}
	}

	/*
	*	创建热力图和图例
	*/
	function createHeatmapAndLegend(heatmapUrl, fieldStr, title, legendDivId, legendName, FeatureLayer, HeatmapRenderer, Legend){
		//创建热力图
		that.heatmapLayer = new FeatureLayer(that.heatmapUrls[heatmapUrl], {mode: FeatureLayer.MODE_SNAPSHOT, field: fieldStr});
		//热力图渲染器
		var heatmapRenderer = new HeatmapRenderer({blurRadius:20});
		that.heatmapLayer.setRenderer(heatmapRenderer);
		//显示热力图
		that.map.addLayer(that.heatmapLayer);
		if(that.legends[legendName] == undefined){
			that.legends[legendName] = new Legend({
				map: that.map,
				layerInfos:[
					{
						layer: that.heatmapLayer,
						title: title
					}
				],
			},legendDivId);
			that.legends[legendName].startup();
		}
	}
};

