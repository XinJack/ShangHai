/**
 * [Shanghai 上海类]
 */
function Shanghai(){
	this.map; //地图对象
	this.initLayer; //底图
	//由于一次只是显示一个热力图层，因此只用一个变量来存储就可以了
	this.heatmapLayer;
  this.heatmapRenderer;
	this.heatmapUrls = {
		SubwayHeatmapUrl:"http://localhost:6080/arcgis/rest/services/热力图/MapServer/0",
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
  //配套设施 记录url地址
  this.facilityFeatureLayer;
  this.facilityLayerOrders = {
    "餐饮": 6,
    "大厦": 5,
    "高速服务区": 7,
    "公安交警": 8,
    "购物": [9, 10],
    "火车站": 11,
    "机场": 12,
    "加油站": 13,
    "交通出行": 14,
    "金融服务": 15,
    "科研教育": 16,
    "旅游": 17,
    "其他设施": [19,20,21],
    "汽车服务": 22,
    "汽车站": 23,
    "收费站": 25,
    "停车场": 26,
    "休闲娱乐": 30,
    "医疗服务": 31,
    "政府机关": 32,
    "住宿": 33,
  };
  this.facilityKinds = {
    //医疗服务
    "药房": "2800",
    "医疗器械": "2801",
    "抢救中心": "7200",
    "综合型医院": "7204",
    "急诊": "7205",
    "体检": "7206",
    "卫生服务中心": "7280",
    "口腔医院": "7281",
    "预防控制中心": "7500",
    "宠物医院": "7580",
    //科研教育
    "培训中心": "7480",
    "大学": "A700",
    "幼儿园": "A701",
    "小学": "A702",
    "中学": "A703",
    "驾校": "A706",
    "职业学校": "A708",
    "教育机构": "A709",
    "研究所": "A880",
    //交通出行
    "汽车站": "8080",
    "火车站": "8081",
    "地铁": "8082",
    "长途客运站": "8083",
    "磁悬浮": "8084",
    "直升机": "8100",
    "飞机场": "8101",
    "渡口码头": "8180",
    "公路出口": "8301",
    "公路入口": "8302",
    
    //大众点评餐饮

  };
};

/**
 * [initializeMap 初始化地图和底图的方法]
 * @param  {[string]} mapDiv [地图所在div层的id]
 * @return {[type]}        [description]
 */
Shanghai.prototype.initializeMap = function(mapDivID){
  var that = this;
  require(["esri/map", "esri/geometry/Extent", "esri/SpatialReference", "esri/layers/ArcGISTiledMapServiceLayer"], function(){
    that.map = new esri.Map(mapDivID,{Extent: new esri.geometry.Extent(120.8599508903131, 31.122347889012865, 122.11833818012421, 31.541810318949906 ,new esri.SpatialReference(4326)), 
    zoom: 2, center: [121.4091445, 31.1220791], logo: false, minZoom: 2});
    //默认底图图层
    that.initLayer = new esri.layers.ArcGISTiledMapServiceLayer("http://localhost:6080/arcgis/rest/services/万科_上海地图/MapServer");
    that.map.addLayer(that.initLayer);
  });
}

/**
 * [findFacilities 根据传入的查找参数查找配套设施]
 * @param  {[int]} distance        [用户勾选的查找距离，地理单位是米] 
 * @param  {[object]} filterConditions [用户勾选的筛选条件，格式如{"科研教育": ["小学", "初中"]}，当用户只勾选大类型时，需要把所有子类型传进来] 
 * @return {[type]}        [description]
 */
Shanghai.prototype.findFacilities = function(distance, filterConditions){
    var that = this;
    require(["esri/tasks/IdentifyTask", "esri/tasks/IdentifyParameters", "esri/symbols/SimpleFillSymbol", "esri/renderers/SimpleRenderer", "esri/symbols/SimpleFillSymbol","esri/symbols/SimpleLineSymbol", "esri/Color", "esri/geometry/Circle", "esri/units", "esri/graphic", "esri/tasks/query"]);
    require("esri/InfoTemplate");
    //先对参数filterConditions进行处理
    var queryLayerIds = []; //查找的大类型：id
    var queryFacillityKinds = []; //查找的小类型：种类
    jQuery.each(filterConditions, function(id, kinds){
      queryLayerIds.push(that.facilityLayerOrders[id]);
      jQuery.each(kinds, function(index, kind){
        queryFacillityKinds.push(that.facilityKinds[kind]);
      });
    });
    
    //创建选择区域的填充样式
    var circleSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new esri.Color([255,0,0]), 2), new esri.Color([255, 0, 0, 0.1]));
    //地图点击事件
    var findFacilitiesEvent = this.map.on("click", function(event){
      //清空地图
      that.map.graphics.clear();
      //查询圆
      var circle = new esri.geometry.Circle({
        center: event.mapPoint, 
        geodesic: true,
        radius: distance,
        radiusUnit: esri.Units.METER
      });
      //圆形区域
      var circleBuffer = new esri.Graphic(circle, circleSymbol);
      //向地图添加圆形区域
      that.map.graphics.add(circleBuffer);
      //视角跳转到圆形区域处
      that.map.centerAndZoom(event.mapPoint, 7);

      //查询任务对象
      var findFacilitiesTask = new esri.tasks.IdentifyTask("http://localhost:6080/arcgis/rest/services/热力图/MapServer");
      //查询参数
      var taskParams = new esri.tasks.IdentifyParameters();
      taskParams.geometry = circle.getExtent();
      taskParams.layerIds = queryLayerIds;
      taskParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
      taskParams.tolerance = 0;
      taskParams.mapExtent = that.map.extent;
      taskParams.returnGeometry = true;
      //执行查询
      findFacilitiesTask.execute(taskParams, function(selectedFacilities){
        //遍历查找结果
        for(var i = 0; i < selectedFacilities.length; ++i){
          //得到查找到设施
          var selectedFacility = selectedFacilities[i].feature;
          var layerName = selectedFacilities[i].layerName;

          //判断查找到的设施是否真的在圆内
          if(circle.contains(selectedFacility.geometry) && isFacilityOfKind(selectedFacility, queryFacillityKinds)){
            //设置查找到的设施的样式
            setGraphicSymbol(layerName, selectedFacility);
            //设施点的信息窗口
            selectedFacility.setInfoTemplate(new esri.InfoTemplate(selectedFacility.attributes["NAME"], "${*}"));
            //显示设施
            that.map.graphics.add(selectedFacility);
          }
          
        }
        findFacilitiesEvent.remove();
      });
      
    });
    /**
     * [setGraphicSymbol 用来设置graphic对象显示样式的方法]
     * @param {[string]} layerName [对象的类型名称]
     * @param {[object]} graphic   [需要设置显示样式的graphic对象]
     */
    function setGraphicSymbol(layerName, graphic){
      require("esri/symbols/PictureMarkerSymbol");
      require("esri/Color");
      var symbol = new esri.symbol.PictureMarkerSymbol({"angle":0,"xoffset":0,"yoffset":0,"url":"","width":20,"height":20});
      //根据对象类型的不同设置不同的显示类型
      switch(layerName.substring(0, layerName.indexOf("_"))){
        case "餐饮":
          symbol.setUrl("Images/餐饮.svg");
          break;
        case "大厦":
          symbol.setUrl("Images/大厦.svg");
          break;
        case "高速服务区":
          symbol.setUrl("Images/高速服务区.svg");
          break;
        case "公安":
          symbol.setUrl("Images/公安.svg");
          break;
        case "公园":
          symbol.setUrl("Images/公园.svg");
          break;
        case "购物":
          symbol.setUrl("Images/购物.svg");
          break;
        case "火车站":
          symbol.setUrl("Images/火车站.svg");
          break;
        case "加油站":
          symbol.setUrl("Images/加油站.svg");
          break;
        case "交通出行":
          symbol.setUrl("Images/交通出行.svg");
          break;
        case "科研教育":
          symbol.setUrl("Images/科研教育.svg");
          break;
        case "酒店":
          symbol.setUrl("Images/酒店.svg");
          break;
        case "其他设施":
          symbol.setUrl("Images/其他设施.svg");
          break;
        case "其他信息":
          symbol.setUrl("Images/其他信息.svg");
          break;
        case "汽车服务":
          symbol.setUrl("Images/汽车服务.svg");
          break;
        case "汽车站":
          symbol.setUrl("Images/汽车站.svg");
          break;
        case "收费站":
          symbol.setUrl("Images/收费站.svg");
          break;
        case "停车场":
          symbol.setUrl("Images/停车场.svg");
          break;
        case "小区":
          symbol.setUrl("Images/小区.svg");
          break;
        case "休闲娱乐":
          symbol.setUrl("Images/休闲娱乐.svg");
          break;
        case "医疗服务":
          symbol.setUrl("Images/医疗服务.svg");
          break;
        case "银行":
          symbol.setUrl("Images/银行.svg");
          break;
        case "政府机关":
          symbol.setUrl("Images/政府机关.svg");
          break;

      }
      graphic.setSymbol(symbol);
    }

    /**
     * [isFacilityOfKind 辅助函数，用于判断某个设施点的类型（如A233）是否属于要查找的类型]
     * @param  {[object]}  facility [设施点，Graphic对象]
     * @param  {[array]}  kinds    [需要查找的类型列表]
     * @return {Boolean}          [设施点是需要查找的话返回true，否则返回false]
     */
    function isFacilityOfKind(facility, kinds){
      return jQuery.inArray(facility.attributes["KIND"], kinds) == -1 ? false : true; 
    };
};

/**
 * [createHeatmapAndLegend 创建热力图以及图例]
 * @param  {[string]} heatmapUrl  [热力图url对应的名称]
 * @param  {[int]} radius      [热力图每个点半径]
 * @param  {[string]} fieldStr    [作为权重的属性]
 * @param  {[string]} title       [图例的名称]
 * @param  {[string]} legendDivId [图例所在的div层id]
 * @param  {[string]} legendName  [图例在Shanghai对象属性中存放的索引名称]
 * @return {[type]}             [description]
 */
Shanghai.prototype.createHeatmapAndLegend = function(heatmapUrl, radius, fieldStr, title, legendDivId, legendName){
    var that = this;
    require(["esri/layers/FeatureLayer", "esri/renderers/HeatmapRenderer"]);
    //热力图图层
    this.heatmapLayer = new esri.layers.FeatureLayer(this.heatmapUrls[heatmapUrl],
       {
          mode: esri.layers.FeatureLayer.MODE_SNAPSHOT, 
          outFields:[
             "o_morn_13",
             "d_morn_13",
             "o_even_13",
             "d_even_13",
             "o_morn_18",
             "d_morn_18",
             "o_even_18",
             "d_even_18",
        ]});

    //热力图渲染器
    //colorStops，ratio表示的是从外到内的距离比例，color是相应的插值颜色
    // this.heatmapRenderer = new esri.renderer.HeatmapRenderer({blurRadius:radius, 
    //   maxPixelIntensity:1, 
    //   field: fieldStr,  
    //   colorStops: [
    //     { ratio: 0, color: "rgba(0, 0, 230, 0)" },
    //         { ratio: 0.5, color: "rgba(0, 0, 255)"},
    //         { ratio: 0.65, color: "rgb(117, 211, 248)" },
    //         { ratio: 0.7, color: "rgba(0, 255, 0)" },
    //         { ratio: 0.9, color: "rgba(255, 234, 0)" },
    //         { ratio: 1.0, color: "rgba(255, 0, 0)"},],
    //     });
    this.heatmapRenderer = new esri.renderer.HeatmapRenderer({blurRadius:radius, 
      maxPixelIntensity:1, 
      field: fieldStr,  
      colorStops: [
        { ratio: 0.0 , color: "rgba(0, 0, 0, 0.3)" },
        { ratio: 0.5, color: "rgba(0, 255, 0)"},
        { ratio: 1.0, color: "rgba(0, 0, 255)"},],
    });
    this.heatmapLayer.setRenderer(this.heatmapRenderer);
    //显示热力图
    this.map.addLayer(this.heatmapLayer);

    //创建热力图图例
    if(this.legends[legendName] == undefined){
      require(["esri/dijit/Legend"], function(Legend){
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
      });
    }
};

/**
 * [getDriveTimePolygon 获取指定时间通过路网所能够到达的区域]
 * @param  {[字符串]} driveTimes [行驶时间，最多可以输入3个，用空格隔开，单位为分钟，格式为“2 5 10”]
 * @return {[type]}            [description]
 */
Shanghai.prototype.getDriveTimePolygon = function(driveTimes){
  var that = this;
  require(["esri/map", "esri/geometry/Extent", "esri/SpatialReference",
    "esri/layers/ArcGISTiledMapServiceLayer", "esri/graphic", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/Color",
    "esri/tasks/Geoprocessor", "esri/tasks/FeatureSet", "esri/tasks/JobInfo", "dojo/domReady!"],
    function (Map, Extent, SpatialReference,
        ArcGISTiledMapServiceLayer, Graphic, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color,
        Geoprocessor, FeatureSet, JobInfo) {
          var gp = new Geoprocessor("http://202.121.178.190:6080/arcgis/rest/services/可达性区域/GPServer/生成服务区");
          that.map.on("click", computeServiceArea);

          function computeServiceArea(evt) {
            that.map.graphics.clear();
            var pointSymbol = new SimpleMarkerSymbol();
            pointSymbol.setOutline = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([255, 0, 0]), 1);
            pointSymbol.setSize(5);
            pointSymbol.setColor(new Color([0, 255, 0, 0.25]));

            var graphic = new Graphic(evt.mapPoint, pointSymbol);
            that.map.graphics.add(graphic);

            var features = [];
            features.push(graphic);
            var featureSet = new FeatureSet();
            featureSet.features = features;
            var params = { "Input_Location": featureSet, "Drive_Time": driveTimes };
            gp.submitJob(params, getDriveTimePolys);
          }

        function getDriveTimePolys(results) {
          var jobId = results.jobId;
          var jobStatus = results.jobStatus;
          if(jobStatus == JobInfo.STATUS_SUCCEEDED){
              gp.getResultData(jobId, "ServiceAreas", function(results){
                for(var i = 0; i < results.value.features.length; ++i){
                  var feature = results.value.features[i];
                  var polySymbolRed = new SimpleFillSymbol();
                    polySymbolRed.setOutline(
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                    new Color([0, 0, 0, 0.5]), 1));
                  switch(i)
                  {
                    case 0: 
                      polySymbolRed.setColor(new Color([255, 0, 0, 0.7]));
                      break;
                    case 1: 
                      polySymbolRed.setColor(new Color([0, 255, 0, 0.7]));
                      break;
                    case 2: 
                      polySymbolRed.setColor(new Color([0, 0, 255, 0.7]));
                      break;
                  }
                  feature.setSymbol(polySymbolRed);
                  that.map.graphics.add(feature);
                }
              });
          }
      }
  });
}
