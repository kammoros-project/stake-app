"use strict";(self.webpackChunkstake_app=self.webpackChunkstake_app||[]).push([[2],{41002:function(r,t,e){e.r(t),e.d(t,{NFTCollection:function(){return h}});var n=e(74165),a=e(15861),c=e(15671),o=e(43144),i=e(97326),u=e(60136),s=e(92572),p=e(52448),f=e(6710),v=e(68624),h=(e(80518),e(25025),e(70332),e(8455),e(97143),e(84255),e(62555),e(26219),e(61303),e(49242),e(94317),e(13670),e(79120),e(97604),e(8187),e(19362),e(54730),e(36250),e(85725),e(38730),e(237),e(65609),e(77208),e(86841),e(49561),e(40553),e(26),e(69392),e(82037),e(78262),e(34161),e(50266),e(98839),e(51375),e(43320),e(65815),e(59189),e(18281),e(24601),e(46878),e(20583),e(92355),e(84194),e(51121),e(32484),e(78435),function(r){(0,u.Z)(e,r);var t=(0,s.Z)(e);function e(r,n,a){var o;(0,c.Z)(this,e);var u=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},s=arguments.length>4?arguments[4]:void 0,v=arguments.length>5?arguments[5]:void 0,h=arguments.length>6&&void 0!==arguments[6]?arguments[6]:new f.co(r,n,s,u);return o=t.call(this,h,a,v),(0,p._)((0,i.Z)(o),"abi",void 0),(0,p._)((0,i.Z)(o),"metadata",void 0),(0,p._)((0,i.Z)(o),"roles",void 0),(0,p._)((0,i.Z)(o),"encoder",void 0),(0,p._)((0,i.Z)(o),"estimator",void 0),(0,p._)((0,i.Z)(o),"events",void 0),(0,p._)((0,i.Z)(o),"sales",void 0),(0,p._)((0,i.Z)(o),"platformFees",void 0),(0,p._)((0,i.Z)(o),"royalties",void 0),(0,p._)((0,i.Z)(o),"owner",void 0),(0,p._)((0,i.Z)(o),"signature",void 0),(0,p._)((0,i.Z)(o),"interceptor",void 0),(0,p._)((0,i.Z)(o),"erc721",void 0),o.abi=s,o.metadata=new f.ag(o.contractWrapper,f.cz,o.storage),o.roles=new f.ah(o.contractWrapper,e.contractRoles),o.royalties=new f.ai(o.contractWrapper,o.metadata),o.sales=new f.aj(o.contractWrapper),o.encoder=new f.af(o.contractWrapper),o.estimator=new f.aQ(o.contractWrapper),o.events=new f.aR(o.contractWrapper),o.platformFees=new f.aT(o.contractWrapper),o.interceptor=new f.aS(o.contractWrapper),o.erc721=new f.av(o.contractWrapper,o.storage,v),o.signature=new f.ay(o.contractWrapper,o.storage),o.owner=new f.aV(o.contractWrapper),o}return(0,o.Z)(e,[{key:"onNetworkUpdated",value:function(r){this.contractWrapper.updateSignerOrProvider(r)}},{key:"getAddress",value:function(){return this.contractWrapper.readContract.address}},{key:"isTransferRestricted",value:function(){var r=(0,a.Z)((0,n.Z)().mark((function r(){var t;return(0,n.Z)().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,this.contractWrapper.readContract.hasRole((0,f.br)("transfer"),v.d);case 2:return t=r.sent,r.abrupt("return",!t);case 4:case"end":return r.stop()}}),r,this)})));return function(){return r.apply(this,arguments)}}()},{key:"mint",value:function(){var r=(0,a.Z)((0,n.Z)().mark((function r(t){return(0,n.Z)().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.abrupt("return",this.erc721.mint(t));case 1:case"end":return r.stop()}}),r,this)})));return function(t){return r.apply(this,arguments)}}()},{key:"mintTo",value:function(){var r=(0,a.Z)((0,n.Z)().mark((function r(t,e){return(0,n.Z)().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.abrupt("return",this.erc721.mintTo(t,e));case 1:case"end":return r.stop()}}),r,this)})));return function(t,e){return r.apply(this,arguments)}}()},{key:"mintBatch",value:function(){var r=(0,a.Z)((0,n.Z)().mark((function r(t){return(0,n.Z)().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.abrupt("return",this.erc721.mintBatch(t));case 1:case"end":return r.stop()}}),r,this)})));return function(t){return r.apply(this,arguments)}}()},{key:"mintBatchTo",value:function(){var r=(0,a.Z)((0,n.Z)().mark((function r(t,e){return(0,n.Z)().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.abrupt("return",this.erc721.mintBatchTo(t,e));case 1:case"end":return r.stop()}}),r,this)})));return function(t,e){return r.apply(this,arguments)}}()},{key:"burn",value:function(){var r=(0,a.Z)((0,n.Z)().mark((function r(t){return(0,n.Z)().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.abrupt("return",this.erc721.burn(t));case 1:case"end":return r.stop()}}),r,this)})));return function(t){return r.apply(this,arguments)}}()},{key:"call",value:function(){var r=(0,a.Z)((0,n.Z)().mark((function r(t){var e,a,c,o,i=arguments;return(0,n.Z)().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:for(a=i.length,c=new Array(a>1?a-1:0),o=1;o<a;o++)c[o-1]=i[o];return r.abrupt("return",(e=this.contractWrapper).call.apply(e,[t].concat(c)));case 2:case"end":return r.stop()}}),r,this)})));return function(t){return r.apply(this,arguments)}}()}]),e}(f.aE));(0,p._)(h,"contractRoles",["admin","minter","transfer"])}}]);
//# sourceMappingURL=2.6d0d0f24.chunk.js.map