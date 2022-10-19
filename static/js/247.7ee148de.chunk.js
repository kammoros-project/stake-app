"use strict";(self.webpackChunkstake_app=self.webpackChunkstake_app||[]).push([[247],{94247:function(e){e.exports=JSON.parse('[{"inputs":[{"internalType":"address","name":"_nativeTokenWrapper","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"timeBuffer","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"bidBufferBps","type":"uint256"}],"name":"AuctionBuffersUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"listingId","type":"uint256"},{"indexed":true,"internalType":"address","name":"closer","type":"address"},{"indexed":true,"internalType":"bool","name":"cancelled","type":"bool"},{"indexed":false,"internalType":"address","name":"auctionCreator","type":"address"},{"indexed":false,"internalType":"address","name":"winningBidder","type":"address"}],"name":"AuctionClosed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"listingId","type":"uint256"},{"indexed":true,"internalType":"address","name":"assetContract","type":"address"},{"indexed":true,"internalType":"address","name":"lister","type":"address"},{"components":[{"internalType":"uint256","name":"listingId","type":"uint256"},{"internalType":"address","name":"tokenOwner","type":"address"},{"internalType":"address","name":"assetContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"uint256","name":"quantity","type":"uint256"},{"internalType":"address","name":"currency","type":"address"},{"internalType":"uint256","name":"reservePricePerToken","type":"uint256"},{"internalType":"uint256","name":"buyoutPricePerToken","type":"uint256"},{"internalType":"enum IMarketplace.TokenType","name":"tokenType","type":"uint8"},{"internalType":"enum IMarketplace.ListingType","name":"listingType","type":"uint8"}],"indexed":false,"internalType":"struct IMarketplace.Listing","name":"listing","type":"tuple"}],"name":"ListingAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"listingId","type":"uint256"},{"indexed":true,"internalType":"address","name":"listingCreator","type":"address"}],"name":"ListingRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"listingId","type":"uint256"},{"indexed":true,"internalType":"address","name":"listingCreator","type":"address"}],"name":"ListingUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"listingId","type":"uint256"},{"indexed":true,"internalType":"address","name":"offeror","type":"address"},{"indexed":true,"internalType":"enum IMarketplace.ListingType","name":"listingType","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"quantityWanted","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalOfferAmount","type":"uint256"},{"indexed":false,"internalType":"address","name":"currency","type":"address"}],"name":"NewOffer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"listingId","type":"uint256"},{"indexed":true,"internalType":"address","name":"assetContract","type":"address"},{"indexed":true,"internalType":"address","name":"lister","type":"address"},{"indexed":false,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"quantityBought","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalPricePaid","type":"uint256"}],"name":"NewSale","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"platformFeeRecipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"platformFeeBps","type":"uint256"}],"name":"PlatformFeeInfoUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_BPS","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_listingId","type":"uint256"},{"internalType":"address","name":"_offeror","type":"address"},{"internalType":"address","name":"_currency","type":"address"},{"internalType":"uint256","name":"_pricePerToken","type":"uint256"}],"name":"acceptOffer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"bidBufferBps","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_listingId","type":"uint256"},{"internalType":"address","name":"_buyFor","type":"address"},{"internalType":"uint256","name":"_quantityToBuy","type":"uint256"},{"internalType":"address","name":"_currency","type":"address"},{"internalType":"uint256","name":"_totalPrice","type":"uint256"}],"name":"buy","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_listingId","type":"uint256"}],"name":"cancelDirectListing","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_listingId","type":"uint256"},{"internalType":"address","name":"_closeFor","type":"address"}],"name":"closeAuction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"contractType","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"contractURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"contractVersion","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"pure","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"assetContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"secondsUntilEndTime","type":"uint256"},{"internalType":"uint256","name":"quantityToList","type":"uint256"},{"internalType":"address","name":"currencyToAccept","type":"address"},{"internalType":"uint256","name":"reservePricePerToken","type":"uint256"},{"internalType":"uint256","name":"buyoutPricePerToken","type":"uint256"},{"internalType":"enum IMarketplace.ListingType","name":"listingType","type":"uint8"}],"internalType":"struct IMarketplace.ListingParameters","name":"_params","type":"tuple"}],"name":"createListing","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getPlatformFeeInfo","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_defaultAdmin","type":"address"},{"internalType":"string","name":"_contractURI","type":"string"},{"internalType":"address[]","name":"_trustedForwarders","type":"address[]"},{"internalType":"address","name":"_platformFeeRecipient","type":"address"},{"internalType":"uint256","name":"_platformFeeBps","type":"uint256"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"forwarder","type":"address"}],"name":"isTrustedForwarder","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"listings","outputs":[{"internalType":"uint256","name":"listingId","type":"uint256"},{"internalType":"address","name":"tokenOwner","type":"address"},{"internalType":"address","name":"assetContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"uint256","name":"quantity","type":"uint256"},{"internalType":"address","name":"currency","type":"address"},{"internalType":"uint256","name":"reservePricePerToken","type":"uint256"},{"internalType":"uint256","name":"buyoutPricePerToken","type":"uint256"},{"internalType":"enum IMarketplace.TokenType","name":"tokenType","type":"uint8"},{"internalType":"enum IMarketplace.ListingType","name":"listingType","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes[]","name":"data","type":"bytes[]"}],"name":"multicall","outputs":[{"internalType":"bytes[]","name":"results","type":"bytes[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_listingId","type":"uint256"},{"internalType":"uint256","name":"_quantityWanted","type":"uint256"},{"internalType":"address","name":"_currency","type":"address"},{"internalType":"uint256","name":"_pricePerToken","type":"uint256"},{"internalType":"uint256","name":"_expirationTimestamp","type":"uint256"}],"name":"offer","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"offers","outputs":[{"internalType":"uint256","name":"listingId","type":"uint256"},{"internalType":"address","name":"offeror","type":"address"},{"internalType":"uint256","name":"quantityWanted","type":"uint256"},{"internalType":"address","name":"currency","type":"address"},{"internalType":"uint256","name":"pricePerToken","type":"uint256"},{"internalType":"uint256","name":"expirationTimestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155BatchReceived","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_timeBuffer","type":"uint256"},{"internalType":"uint256","name":"_bidBufferBps","type":"uint256"}],"name":"setAuctionBuffers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_uri","type":"string"}],"name":"setContractURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_platformFeeRecipient","type":"address"},{"internalType":"uint256","name":"_platformFeeBps","type":"uint256"}],"name":"setPlatformFeeInfo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"timeBuffer","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalListings","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_listingId","type":"uint256"},{"internalType":"uint256","name":"_quantityToList","type":"uint256"},{"internalType":"uint256","name":"_reservePricePerToken","type":"uint256"},{"internalType":"uint256","name":"_buyoutPricePerToken","type":"uint256"},{"internalType":"address","name":"_currencyToAccept","type":"address"},{"internalType":"uint256","name":"_startTime","type":"uint256"},{"internalType":"uint256","name":"_secondsUntilEndTime","type":"uint256"}],"name":"updateListing","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"winningBid","outputs":[{"internalType":"uint256","name":"listingId","type":"uint256"},{"internalType":"address","name":"offeror","type":"address"},{"internalType":"uint256","name":"quantityWanted","type":"uint256"},{"internalType":"address","name":"currency","type":"address"},{"internalType":"uint256","name":"pricePerToken","type":"uint256"},{"internalType":"uint256","name":"expirationTimestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]')}}]);