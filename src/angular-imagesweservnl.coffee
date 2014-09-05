isLocalUrl = (url) -> new RegExp('https?://localhost(:|/)').test(url)

class ImagesWeservNlService
  @$inject  =  ['$http']
  constructor: (@$http ) ->
    @apiUrl = 'http://images.weserv.nl/'

  _getUrlWithoutProtocol: (url) ->
    return unless url
    url.split('://')[1]

  _isProxifiedUrl: (url) -> url.indexOf(@apiUrl) == 0

  getProxyUrl: (imageUrl, maxWidth, maxHeight) ->
    if @_isProxifiedUrl(imageUrl) && (maxWidth || maxHeight)
      throw new Error('TODO: unproxify URLs')

    proxyUrl = @apiUrl + '?url=' + @_getUrlWithoutProtocol(imageUrl)
    proxyUrl = proxyUrl + '&w=' + maxWidth if maxWidth
    proxyUrl = proxyUrl + '&h=' + maxHeight if maxHeight
    proxyUrl

  getDataUri: (imageUrl) ->
    if isLocalUrl(imageUrl)
      throw new Error('Cant use proxy with local urls.')
    # better then yql data.uri queries because they have a very low size limit
    proxyUrl = @getProxyUrl(imageUrl)
    @$http.get(proxyUrl,
      yqlBridge: true
      yqlTable: 'html'
      params:
        encoding: 'base64'
    )
    .then((response) -> response.data.body.p)

angular.module('images-weserv-nl', ['yql'])
  .service('imagesWeservNl', ImagesWeservNlService)
