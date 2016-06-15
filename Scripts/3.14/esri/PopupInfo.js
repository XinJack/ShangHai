// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.14/esri/copyright.txt for details.
//>>built
define("esri/PopupInfo","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/json dojo/i18n dojo/has dojo/Deferred dojo/sniff dojo/promise/all ./lang ./kernel ./request ./tasks/query ./tasks/QueryTask ./tasks/StatisticDefinition dojo/i18n!dojo/cldr/nls/number".split(" "),function(r,g,m,C,M,H,D,I,x,p,E,J,F,K,L,G){r=r(null,{declaredClass:"esri.PopupInfo",initialize:function(a,b){if(a){g.mixin(this,b);this.info=a;this.title=this.getTitle;this.content=this.getContent;var c=this._fieldLabels=
{},d=this._fieldsMap={};a.fieldInfos&&m.forEach(a.fieldInfos,function(a){var b=a.fieldName.toLowerCase();c[b]=a.label;d[b]=a});this._relatedFieldPrefix="relationships/";this.titleHasRelatedFields=!!(a.title&&-1!==a.title.indexOf("{"+this._relatedFieldPrefix))}},toJson:function(){return C.fromJson(C.toJson(this.info))},getTitle:function(){},getContent:function(){},getFieldInfo:function(a){var b;m.some(this.info&&this.info.fieldInfos,function(c){c.fieldName===a&&(b=c);return!!b});return b},getComponents:function(a){var b=
this.info,c=new D,d,e;b.fieldInfos&&(e=m.filter(b.fieldInfos,function(a){return-1!==a.fieldName.indexOf(this._relatedFieldPrefix)},this));e&&0<e.length&&(d=this._getRelatedRecords({graphic:a,fieldsInfo:e}));d?d.always(g.hitch(this,function(){c.resolve(this._getPopupValues(a))})):c.resolve(this._getPopupValues(a));return c.promise},getAttachments:function(a){var b=a.getLayer();a=a.attributes;if(this.info.showAttachments&&(b&&b.hasAttachments&&b.objectIdField)&&(a=a&&a[b.objectIdField]))return b.queryAttachmentInfos(a)},
_getPopupValues:function(a,b){var c=this.info,d=a.getLayer(),e=g.clone(a.attributes)||{},f=g.clone(e),q=c.fieldInfos,k="",h="",y,n,l,v,s,u=d&&d._getDateOpts&&d._getDateOpts().properties,u=u&&u.slice(0),t={dateFormat:{properties:u,formatter:"DateFormat"+this._insertOffset(this._dateFormats.shortDateShortTime)}};if(this._relatedInfo)for(v in this._relatedInfo)if(this._relatedInfo.hasOwnProperty(v)){var w=this._relatedInfo[v],r=this._relatedLayersInfo[v];w&&(m.forEach(w.relatedFeatures,function(a){for(s in a.attributes)if(a.attributes.hasOwnProperty(s)&&
"esriRelCardinalityOneToOne"===r.relation.cardinality){var b=this._toRelatedFieldName([r.relation.id,s]);e[b]=f[b]=a.attributes[s]}},this),m.forEach(w.relatedStatsFeatures,function(a){for(s in a.attributes)if(a.attributes.hasOwnProperty(s)){var b=this._toRelatedFieldName([r.relation.id,s]);e[b]=f[b]=a.attributes[s]}},this))}q&&m.forEach(q,function(a){n=a.fieldName;var b=this._getLayerFieldInfo(d,n);b&&(n=a.fieldName=b.name);f[n]=this._formatValue(f[n],n,t);u&&(a.format&&a.format.dateFormat)&&(a=m.indexOf(u,
n),-1<a&&u.splice(a,1))},this);if(d){v=d.types;var x=(w=d.typeIdField)&&e[w];for(n in e)if(e.hasOwnProperty(n)&&-1===n.indexOf(this._relatedFieldPrefix)&&(l=e[n],p.isDefined(l))){var z=this._getDomainName(d,a,v,x,n,l);p.isDefined(z)?f[n]=z:n===w&&(z=this._getTypeName(d,a,l),p.isDefined(z)&&(f[n]=z))}}c.title&&(k=this._processFieldsInLinks(this._fixTokens(c.title,d),e),k=g.trim(p.substitute(f,k,t)||""));if(b)return{title:k};c.description&&(h=this._processFieldsInLinks(this._fixTokens(c.description,
d),e),h=g.trim(p.substitute(f,h,t)||""));q&&(y=[],m.forEach(q,function(a){(n=a.fieldName)&&a.visible&&y.push([a.label||n,p.substitute(f,"${"+n+"}",t)||""])}));var A,B;c.mediaInfos&&(A=[],m.forEach(c.mediaInfos,function(a){B=0;l=a.value;switch(a.type){case "image":var b=l.sourceURL,b=b&&g.trim(p.substitute(e,this._fixTokens(b,d)));B=!!b;break;case "piechart":case "linechart":case "columnchart":case "barchart":var c,b=l.normalizeField;l.fields=m.map(l.fields,function(a){return(c=this._getLayerFieldInfo(d,
a))?c.name:a},this);b&&(c=this._getLayerFieldInfo(d,b),l.normalizeField=c?c.name:b);B=m.some(l.fields,function(a){return p.isDefined(e[a])||-1!==a.indexOf(this._relatedFieldPrefix)&&this._relatedInfo},this);break;default:return}if(B){a=g.clone(a);l=a.value;var b=a.title?this._processFieldsInLinks(this._fixTokens(a.title,d),e):"",n=a.caption?this._processFieldsInLinks(this._fixTokens(a.caption,d),e):"";a.title=b?g.trim(p.substitute(f,b,t)||""):"";a.caption=n?g.trim(p.substitute(f,n,t)||""):"";if("image"===
a.type)l.sourceURL=p.substitute(e,this._fixTokens(l.sourceURL,d)),l.linkURL&&(l.linkURL=g.trim(p.substitute(e,this._fixTokens(l.linkURL,d))||""));else{var k,h;m.forEach(l.fields,function(a,b){if(-1!==a.indexOf(this._relatedFieldPrefix))h=this._getRelatedChartInfos(a,l,e,t),h instanceof Array?l.fields=h:l.fields[b]=h;else{var c=e[a],c=void 0===c?null:c;k=e[l.normalizeField]||0;c&&k&&(c/=k);l.fields[b]={y:c,tooltip:(this._fieldLabels[a.toLowerCase()]||a)+":\x3cbr/\x3e"+this._formatValue(c,a,t,!!k)}}},
this)}A.push(a)}},this));return{title:k,description:h,hasDescription:!!c.description,fields:y&&y.length?y:null,mediaInfos:A&&A.length?A:null,formatted:f,editSummary:d&&d.getEditSummary?d.getEditSummary(a):""}},_getRelatedChartInfos:function(a,b,c,d){var e,f,q,k,h,g;e=[];g=this._fromRelatedFieldName(a);h=g[0];f=this._relatedInfo[h];h=this._relatedLayersInfo[h];f&&m.forEach(f.relatedFeatures,function(f){f=f.attributes;var l,h;for(h in f)if(f.hasOwnProperty(h)&&h===g[1]){l={};k=f[h];b.normalizeField&&
(q=-1!==b.normalizeField.indexOf(this._relatedFieldPrefix)?f[this._fromRelatedFieldName(b.normalizeField)[1]]:c[b.normalizeField]);k&&q&&(k/=q);if(b.tooltipField)if(-1!==b.tooltipField.indexOf(this._relatedFieldPrefix)){var m=this._fromRelatedFieldName(b.tooltipField)[1];l.tooltip=f[m]&&"string"===typeof f[m]?f[m]+":\x3cbr/\x3e"+this._formatValue(k,f[m],d,!!q):m+":\x3cbr/\x3e"+this._formatValue(k,m,d,!!q)}else l.tooltip=(this._fieldLabels[a.toLowerCase()]||a)+":\x3cbr/\x3e"+this._formatValue(k,b.tooltipField,
d,!!q);else l.tooltip=k;l.y=k;e.push(l)}},this);return"esriRelCardinalityOneToMany"===h.relation.cardinality||"esriRelCardinalityManyToMany"===h.relation.cardinality?e:e[0]},_dateFormats:{shortDate:"(datePattern: 'M/d/y', selector: 'date')",shortDateLE:"(datePattern: 'd/M/y', selector: 'date')",longMonthDayYear:"(datePattern: 'MMMM d, y', selector: 'date')",dayShortMonthYear:"(datePattern: 'd MMM y', selector: 'date')",longDate:"(datePattern: 'EEEE, MMMM d, y', selector: 'date')",shortDateShortTime:"(datePattern: 'M/d/y', timePattern: 'h:mm a', selector: 'date and time')",
shortDateLEShortTime:"(datePattern: 'd/M/y', timePattern: 'h:mm a', selector: 'date and time')",shortDateShortTime24:"(datePattern: 'M/d/y', timePattern: 'H:mm', selector: 'date and time')",shortDateLEShortTime24:"(datePattern: 'd/M/y', timePattern: 'H:mm', selector: 'date and time')",shortDateLongTime:"(datePattern: 'M/d/y', timePattern: 'h:mm:ss a', selector: 'date and time')",shortDateLELongTime:"(datePattern: 'd/M/y', timePattern: 'h:mm:ss a', selector: 'date and time')",shortDateLongTime24:"(datePattern: 'M/d/y', timePattern: 'H:mm:ss', selector: 'date and time')",
shortDateLELongTime24:"(datePattern: 'd/M/y', timePattern: 'H:mm:ss', selector: 'date and time')",longMonthYear:"(datePattern: 'MMMM y', selector: 'date')",shortMonthYear:"(datePattern: 'MMM y', selector: 'date')",year:"(datePattern: 'y', selector: 'date')"},_reHref:/href\s*=\s*\"([^\"]+)\"/ig,_reHrefApos:/href\s*=\s*\'([^\']+)\'/ig,_fixTokens:function(a,b){var c=this;return a.replace(/(\{([^\{\r\n]+)\})/g,function(a,e,f){a=c._getLayerFieldInfo(b,f);return"$"+(a?"{"+a.name+"}":e)})},_encodeAttributes:function(a){a=
g.clone(a)||{};var b,c;for(b in a)if((c=a[b])&&"string"===typeof c)c=encodeURIComponent(c).replace(/\'/g,"\x26apos;"),a[b]=c;return a},_processFieldsInLinks:function(a,b){var c=this._encodeAttributes(b),d=this;a&&(a=a.replace(this._reHref,function(a,f){return d._addValuesToHref(a,f,b,c)}).replace(this._reHrefApos,function(a,f){return d._addValuesToHref(a,f,b,c)}));return a},_addValuesToHref:function(a,b,c,d){b=b&&g.trim(b);return p.substitute(b&&0===b.indexOf("${")?c:d,a)},_getLayerFieldInfo:function(a,
b){return a&&a.getField?a.getField(b):null},_formatValue:function(a,b,c,d){var e=this._fieldsMap[b.toLowerCase()],f=e&&e.format,q=-1!==m.indexOf(c.dateFormat.properties,b);b="number"===typeof a&&!q&&(!f||!f.dateFormat);if(!p.isDefined(a)||!e||!p.isDefined(f))return b?this._forceLTR(a):a;var k="",h=[],e=f.hasOwnProperty("places")||f.hasOwnProperty("digitSeparator"),g=f.hasOwnProperty("digitSeparator")?f.digitSeparator:!0;if(e&&!q)k="NumberFormat",h.push("places: "+(p.isDefined(f.places)&&(!d||0<f.places)?
Number(f.places):"Infinity")),h.length&&(k+="("+h.join(",")+")");else if(f.dateFormat)k="DateFormat"+this._insertOffset(this._dateFormats[f.dateFormat]||this._dateFormats.shortDateShortTime);else return b?this._forceLTR(a):a;a=p.substitute({myKey:a},"${myKey:"+k+"}",c)||"";e&&!g&&G.group&&(a=a.replace(RegExp("\\"+G.group,"g"),""));return b?this._forceLTR(a):a},_forceLTR:function(a){var b=I("ie");return b&&10>=b?a:"\x3cspan class\x3d'esriNumericValue'\x3e"+a+"\x3c/span\x3e"},_insertOffset:function(a){a&&
(a=p.isDefined(this.utcOffset)?a.replace(/\)\s*$/,", utcOffset:"+this.utcOffset+")"):a);return a},_getDomainName:function(a,b,c,d,e,f){return(a=a.getDomain&&a.getDomain(e,{feature:b}))&&a.codedValues?a.getName(f):null},_getTypeName:function(a,b,c){return(a=a.getType&&a.getType(b))&&a.name},_getRelatedRecords:function(a){var b=a.graphic,c=new D,d;this._relatedLayersInfo?this._queryRelatedLayers(b).then(g.hitch(this,function(a){this._setRelatedRecords(b,a);c.resolve(a)}),g.hitch(this,this._handlerErrorResponse,
c)):this._getRelatedLayersInfo(a).then(g.hitch(this,function(a){for(d in a)a.hasOwnProperty(d)&&a[d]&&(this._relatedLayersInfo[d].relatedLayerInfo=a[d]);this._queryRelatedLayers(b).then(g.hitch(this,function(a){this._setRelatedRecords(b,a);c.resolve(a)}),g.hitch(this,this._handlerErrorResponse,c))}),g.hitch(this,this._handlerErrorResponse,c));return c.promise},_getRelatedLayersInfo:function(a){var b=a.fieldsInfo,c,d,e={};c=a.graphic.getLayer();this._relatedLayersInfo||(this._relatedLayersInfo={});
m.forEach(b,function(a){var b,d,e,g;b=this._fromRelatedFieldName(a.fieldName);d=b[0];b=b[1];d&&(this._relatedLayersInfo[d]||(m.some(c.relationships,function(a){if(a.id==d)return g=a,!0}),g&&(this._relatedLayersInfo[d]={relation:g,relatedFields:[],outStatistics:[]})),this._relatedLayersInfo[d]&&(this._relatedLayersInfo[d].relatedFields.push(b),a.statisticType&&(e=new L,e.statisticType=a.statisticType,e.onStatisticField=b,e.outStatisticFieldName=b,this._relatedLayersInfo[d].outStatistics.push(e))))},
this);for(d in this._relatedLayersInfo)this._relatedLayersInfo.hasOwnProperty(d)&&this._relatedLayersInfo[d]&&(a=this._relatedLayersInfo[d].relation,a=c.url.replace(/[0-9]+$/,a.relatedTableId),this._relatedLayersInfo[d].relatedLayerUrl=a,e[d]=J({url:a,content:{f:"json"},callbackParamName:"callback"}));return x(e)},_queryRelatedLayers:function(a){var b={},c;for(c in this._relatedLayersInfo)this._relatedLayersInfo.hasOwnProperty(c)&&(b[c]=this._queryRelatedLayer({graphic:a,relatedInfo:this._relatedLayersInfo[c]}));
return x(b)},_queryRelatedLayer:function(a){var b,c,d,e,f,g,k,h,p,n;b=a.graphic;c=b.getLayer().url.match(/[0-9]+$/g)[0];h=a.relatedInfo;k=h.relatedLayerInfo;p=h.relatedLayerUrl;n=h.relation;m.some(k.relationships,function(a){if(a.relatedTableId===parseInt(c,10))return d=a,!0},this);d&&(a=new F,m.some(k.fields,function(a){if(a.name===d.keyField)return f=-1!==m.indexOf(["esriFieldTypeSmallInteger","esriFieldTypeInteger","esriFieldTypeSingle","esriFieldTypeDouble"],a.type)?"number":"string",!0}),e="string"===
f?d.keyField+"\x3d'"+b.attributes[n.keyField]+"'":d.keyField+"\x3d"+b.attributes[n.keyField],a.where=e,a.outFields=h.relatedFields,h.outStatistics&&(0<h.outStatistics.length&&k.supportsStatistics)&&(g=new F,g.where=a.where,g.outFields=a.outFields,g.outStatistics=h.outStatistics),b=new K(p),e=[],e.push(b.execute(a)),g&&e.push(b.execute(g)));return x(e)},_setRelatedRecords:function(a,b){this._relatedInfo=[];for(var c in b)if(b.hasOwnProperty(c)&&b[c]){var d=b[c];this._relatedInfo[c]={};this._relatedInfo[c].relatedFeatures=
d[0].features;p.isDefined(d[1])&&(this._relatedInfo[c].relatedStatsFeatures=d[1].features)}},_handlerErrorResponse:function(a,b){a.reject(b)},_fromRelatedFieldName:function(a){var b=[];-1!==a.indexOf(this._relatedFieldPrefix)&&(a=a.split("/"),b=a.slice(1));return b},_toRelatedFieldName:function(a){var b="";a&&0<a.length&&(b=this._relatedFieldPrefix+a[0]+"/"+a[1]);return b}});H("extend-esri")&&(E.PopupInfo=E.PopupInfoTemplate=r);return r});