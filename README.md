# youtube-search-results-pages

YouTube 検索結果を csv ファイルに保存する。

# 使い方

https://console.cloud.google.com/ で API キーを取得します。  
環境変数 `YOUTUBE_API_KEY` に API キーを設定します。  
`npm start {検索条件}` で実行できます。検索結果は `./result.csv` に保存されます。

```bash
export YOUTUBE_API_KEY=YOUR_API_KEY
npm install
npm start 'part=snippet&channelId=UC5CTV3JSdrlo5Pa42QkK8SA&order=date&type=video&maxResults=50'
```

検索条件クエリは [YouTube Data API v3 ドキュメント](https://developers.google.com/youtube/v3/docs/search/list?hl=ja) を参照してください。

## チャンネルIDの調べ方

チャンネルIDを知りたい場合は、チャンネルページでブラウザの開発者ツールを開き以下のコンソールを実行すると取得できます。

```js
const element = document.querySelector(`[itemprop="channelId"]`);
const content = element.getAttribute("content");
console.log(content);
```

## クォータの使用量

YouTube Data API にはクォータがあり、クォータを超過すると 403 エラーが返ってきます。

https://developers.google.com/youtube/v3/getting-started?hl=ja#quota

API キーのクォータの使用量は、[Google API Console](https://console.cloud.google.com/apis/dashboard?hl=ja) で確認できます。  

1日ごとにクォータはリセットされます。

# 開発

lint があります。

```bash
npm run lint:fix && npm start 'part=snippet&channelId=UC5CTV3JSdrlo5Pa42QkK8SA&order=date&type=video&maxResults=50'
```
