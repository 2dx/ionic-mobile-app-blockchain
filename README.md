CERTICLE
========================
https://github.com/phonegap/phonegap-plugin-barcodescanner/issues/616

* コンセンサスアルゴリズム PoS
* ブロック生成間隔 1 minute以下（リーダーが作成したいと思えばいつでも作成できる）

#### NOTE
* pynode: サーバーサイドはPython3 (bottle+gevent)
* jslib: クライアントサイドのライブラリはJavaScriptで整備
* mobile: JavaScriptライブラリを使ってionicで送金アプリを作る

#### バイト長さ

* 秘密鍵   : 256 bit (32 byte)
* 公開鍵   : 256 bit (32 byte)
* ハッシュ : 256 bit (32 byte)
* 署名    : 512 bit (64 byte)

#### コンセンサス
* ✅プログラムにハードコードされたURLからgenesisブロックをダウンロードする。
* ✅genesisブロックからトランザクションを読み込む。
* ✅読み込んだトランザクションをsqliteデータベースに反映する。base.xaに関してはnodesにも反映する。
* ✅プログラムにハードコードされたURLからエンドポイントが記載された初期ノードリストを1度だけ取得し、nodesデータベースに該当するアドレスが存在すれば。
* 🙆初期ノードリストは定期的に手動で更新する。
* ✅base.xaを持つアドレスはデータベースで管理し、base.xaが移動したとき、エンドポイントの変更があったときには更新する
* 🙆各ノードは自身の持つノードリストを公開するAPIをもつ（他のノードが知らない可能性があるのはエンドポイントのみ）。
* 🙆エンドポイントを変更したノード、あるいは、新規のノードは、自分の署名を付けて公開鍵とエンドポイントのセットを既知のノードに送信する。
* 🙆それを受け取ったノードは署名を検証し、自分のノードリストを更新する。
* 🙆各ノード間で、定期的にノードリストの交換を行う。交換によって更新が必要であるとわかったときには、変更先のエンドポイントに対してリクエストを発行し、正しい署名付きのレスポンスが得られるかを検証する。
* ✅ノードリストにはアクセスの可否によらず、base.xaを保有するすべてのアカウントの公開鍵が記載される。
* ✅ノードリストの公開鍵のリストから、一意な方法で残高に応じた当選確率で順位を決定する。各ノードはこのランクリストを共通に生成することが前提である。
* ✅このランクリストを用いて一意な順位を決定し、上位のノードから生存確認を行い、全ノードが一意なリーダーを計算する。
* ✅リーダーはブロックを生成し、他のノードにブロードキャストする。
* ✅preprepareとprepareを経て、各ノードがブロックを保存する。

#### 証明書発行
* 証明書発行トランザクションも送金トランザクションと同様に記録される。読み出し時にデータベースにも転記する。データベースには、(一意なモザイクid:hex16文字(8バイト)、トランザクションのデータ)を格納する。idは証明書発行時にランダムにユーザーが生成する。アナウンス時、ブロック生成時などに、過去の証明書と重複があればリジェクトする。証明書情報取得時はidによって検索する。

#### ブロックに含める情報  
```
{
	"timeStamp": 9022656,
	"hash": "0a3d6bea020bb1a503364c37d57392342f368389bb23b05799c54d536d94749b",
	"signature": "256ebcfa4f92e2881963359c51095a390b9f4d1b3fee75ae19f96d5e6bcf055abbcaae3e55bcc17e6214924e4e6a9ebbe77357236b1a235e944950b851bda804",
	"signer": "6c66ea288522990db7a0a63c9c20f532cdcb68dc3c9544fb20f7322c92ceadbb",
	"height": 39324,
	"version": 1744830465,
	"data":{
		"prevBlockHash": "0a3d6bea020bb1a503364c37d57392342f368389bb23b05799c54d536d94749b",
		"transactions": [
			Transaction1, Transaction2, …, Transaction11
		],
		"nonce":"0a3d6bea020bb1a503364c37d57392342f368389bb23b05799c54d536d94749b"
	}
}
```

#### モザイクの種類
* base.xmc 基軸通貨　価値を持つ
* base.authority 基軸通貨　権威を表す
* cert.[address].[product name].[datetime] 作物証明トークン

#### トランザクションの種類
* Transfer Transaction
* Authority Delegate Transaction
* Authority Naming Transaction
* Certificate Definition Transaction

#### トランザクションの内容
* Transfer Transaction (type:0)  
基軸通貨、証明書トークンを移転するときに用いるトランザクション。証明書トークンが含まれる場合には受領トランザクションによって承認される必要がある。


```
{
	"timeStamp": 892734924,
	"fee": 15,
	"recipient": "TC4WKOGT6V2B6O5LKBMBMBC6UBIARCSX7R4WPJCV",
	"type": TRANSACTION_TYPE.TRANSFER_TRANSACTION,
	"deadline": 892738524,
	"message":
	{
		"payload": "hello",
		"type": 1
	},
	"version": Enum.VERSION.TESTNET,
	"signer": "0c38cc1d69eb8f673a8803cf976f12e3639f868b0cfe75d1477cbf59643b6357",
	"mosaics":[
		{
			"id": "0000000000000000"
			"quantity": 100000
		},
		{
			"id": "08a12ab57fdd8901",
			"quantity": 100
		}
	]
}
```

* Authority Delegate Transaction (type:1)  
origin.authorityを移転することなくAuthorityScoreを委任するトランザクション。

```
{
	"timeStamp": 892734924,
	"fee": 15,
	"delta": -1200,
	"recipient": "TC4WKOGT6V2B6O5LKBMBMBC6UBIARCSX7R4WPJCV",
	"type": Enum.TRANSACTION_TYPE.AUTHORITY_DELEGATE_TRANSACTION,
	"deadline": 892738524,
	"version": Enum.VERSION.TESTNET,
	"signer": "0c38cc1d69eb8f673a8803cf976f12e3639f868b0cfe75d1477cbf59643b6357"
}
```

* Authority Naming Transaction (type:2)  
origin.authorityの委任先に名前をつけるトランザクション。

```
{
	"timeStamp": 892734924,
	"fee": 15,
	"name": "An apple farmer in Aomori Prefecture. Pesticide-free.",
	"recipient": "TC4WKOGT6V2B6O5LKBMBMBC6UBIARCSX7R4WPJCV",
	"type": Enum.TRANSACTION_TYPE.AUTHORITY_NAMING_TRANSACTION,
	"deadline": 892738524,
	"version": Enum.VERSION.TESTNET,
	"signer": "0c38cc1d69eb8f673a8803cf976f12e3639f868b0cfe75d1477cbf59643b6357"
}
```
	
* Certificate Definition Transaction (type:3)  
作物証明トークンの定義を行うトランザクション。

```
{
	"timeStamp": 892734924,
	"fee": 15,
	"type": Enum.TRANSACTION_TYPE.CERTIFICATE_DEFINITION_TRANSACTION,
	"deadline": 892738524,
	"version": Enum.VERSION.TESTNET,
	"signer": "0c38cc1d69eb8f673a8803cf976f12e3639f868b0cfe75d1477cbf59643b6357",
	"certificateDefinition": {
		"description": "this is apple (rank B) cerificate.",
		"id": "64a29105fc1a5c7e",
		"name": "Apple_B.20170908",
		"expire": 892934924,
		"properties": [{
				"name": "divisibility",
				"value": "3"
			},{
				"name": "supply",
				"value": "130"
			},{
				"name": "unit",
				"value": "kg"
			}
		]
	}
}
```
	
* Receiving Transaction (type:4)  
受領トランザクション。承認される必要があるトランザクションを確定させる。

```
{
	"timeStamp": 892734924,
	"original":{
		"data": "0c38cc1d69eb8f673a8803cf976f12e3639f868b0cfe75d1477cbf59643b63570c38cc1d69eb8f673a8803cf976f12e3639f868b00c38cc1d69eb8f673a8803cf976f12e3639f868b0cfe75d1477cbf59643b6357cfe75d1477cbf59643b6357"
		"signature": "0c38cc1d69eb8f673a8803cf976f12e3639f868b0cfe75d1477cbf59643b63570c38cc1d69eb8f673a8803cf976f12e3639f868b0cfe75d1477cbf59643b6357"
	}
}
```
	
* Invoice Transaction (type:5)  
作物証明トークンと引き換えにbase.xmcを要求するトランザクション。受領トランザクションによって承認される必要がある。


```
{
	
}
```