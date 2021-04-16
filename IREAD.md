### 踩坑

npm login 之前，需要先把 淘宝源换成正常源

npm publish 之后，下载下来报 `无法找到模块“xxxxx”的声明文件`

- 这个是因为我没有加 `xxx.d.ts` 且需要在 `package.json 里 写上"typings": "types/index.d.ts",`
