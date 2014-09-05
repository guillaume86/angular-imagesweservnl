(function() {
  var ImagesWeservNlService, isLocalUrl;

  isLocalUrl = function(url) {
    return new RegExp('https?://localhost(:|/)').test(url);
  };

  ImagesWeservNlService = (function() {
    ImagesWeservNlService.$inject = ['$http'];

    function ImagesWeservNlService($http) {
      this.$http = $http;
      this.apiUrl = 'http://images.weserv.nl/';
    }

    ImagesWeservNlService.prototype._getUrlWithoutProtocol = function(url) {
      if (!url) {
        return;
      }
      return url.split('://')[1];
    };

    ImagesWeservNlService.prototype._isProxifiedUrl = function(url) {
      return url.indexOf(this.apiUrl) === 0;
    };

    ImagesWeservNlService.prototype.getProxyUrl = function(imageUrl, maxWidth, maxHeight) {
      var proxyUrl;
      if (this._isProxifiedUrl(imageUrl) && (maxWidth || maxHeight)) {
        throw new Error('TODO: unproxify URLs');
      }
      proxyUrl = this.apiUrl + '?url=' + this._getUrlWithoutProtocol(imageUrl);
      if (maxWidth) {
        proxyUrl = proxyUrl + '&w=' + maxWidth;
      }
      if (maxHeight) {
        proxyUrl = proxyUrl + '&h=' + maxHeight;
      }
      return proxyUrl;
    };

    ImagesWeservNlService.prototype.getDataUri = function(imageUrl) {
      var proxyUrl;
      if (isLocalUrl(imageUrl)) {
        throw new Error('Cant use proxy with local urls.');
      }
      proxyUrl = this.getProxyUrl(imageUrl);
      return this.$http.get(proxyUrl, {
        yqlBridge: true,
        yqlTable: 'html',
        params: {
          encoding: 'base64'
        }
      }).then(function(response) {
        return response.data.body.p;
      });
    };

    return ImagesWeservNlService;

  })();

  angular.module('images-weserv-nl', ['yql']).service('imagesWeservNl', ImagesWeservNlService);

}).call(this);
