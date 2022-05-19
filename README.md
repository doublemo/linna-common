linna-common
===

> Linna服务器的运行时框架.

此代码库定义了所使用的运行时API和协议接口 [Linna](https://github.com/doublemo/linna).

代码被分解为运行时框架不同部分的包:

* `api` - GRPC和一些实时API中使用的请求/响应消息.
* `rtapi` - 通过套接字连接发送和接收的实时消息.
* `runtime` - Linna 插件用于执行本机逻辑的Go类型和功能接口

### 构建

要构建代码库并生成所有源代码，请使用以下步骤。

1. 安装Go工具链和protoc工具链.

2. 安装protoc-gen-go插件以生成go代码.

   ```shell
   go install "google.golang.org/protobuf/cmd/protoc-gen-go"
   ```

3. 指定Go运行环境地址,使用Go generate command.

   ```shell
   env PATH="$HOME/go/bin:$PATH" go generate -x ./...
   ```

### 在Go插件中使用

1. 安装Go.

   __NOTE:__ 您必须使用与构建服务器时使用的特定版本完全相同的Go工具链版本。使用“-logger.level DEBUG”运行服务器以查看使用的Go运行时版本。

2. 创建项目.

   ```shell
   go mod init "myproject/server"
   ```

3. 添加包.

   ```shell
   go get -u "github.com/heroiclabs/nakama-common/runtime"
   go mod vendor
   ```

3. 执行编译
   ```shell
   go build -buildmode=plugin -trimpath
   ```
