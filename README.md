# Express API Server Template in Typescript
**Author:** Stephen Tse \<Stephen.Xie@sa.gov.au\>  
**Last Edit:** 13/07/2017  
**Reflecting Project Version:** 1.2.0  
**How to read this file with format:** On Windows, open in Visual Studio Code, press `Ctrl`+`K`, release the keys, then press `V` to open the built-in markdown preview window.

This is a small API server I wrote to demonstrate the possibility of a (reasonably) secure and fast standalone API server based on the Express.js framework. It serves as a template for building the actual API server that incorporates codes for interacting with the backend databases. Typescript is just a language of choice I made at the time (and is also a good practice for me to code in Typescript!). You may directly modify the transpiled version (ES5) of the project if you don't like typescript. The transpiler of Typescript does a pretty good job in generating clean and readable codes!


To test the server on the fly: `npm run test`.

To transpile the project to ES5 codes on the fly: `npm run build`.  
(Find transpiled version in the `/build` directory; if you make changes to `/certs` and `package.json` in the base project, be sure to also include them in `/build`.)

# Features

* Support multiple routes & URL query strings.

* Support parallel processing based on the amount of server processor cores.

* Support response body compression (GZip) for all requests for faster loading time.

* Support SSL connection and HTTP redirection to HTTPS.  
  (You will need admin priviledge to access port 80 (HTTP) and 443 (HTTPS); change the ports to numbers > 1000 temporarily if you are not an admin during testing.)

* Support HTTP access control (CORS).

* Added protection to common web attacks with [Helmet](https://helmetjs.github.io/).


# How to generate new certificates for testing?

The project currently includes temporary certificates I used for testing HTTPS functionality. They're stored in the `/certs` directory. If you want to generate your own pairs, use the `openssl` command-line tool on Unix systems.  **Be sure to use only legitimate certs for deployment!**

To use `openssl` on Windows before version 10, download a Unix software development environment such as the `MinGW-w64` distribution inside [MSYS2](http://www.msys2.org/) for x64 systems (I don't recommend using `Cygwin` in commercial production for license concerns), then install `openssl` (On `MSYS2`: `pacman -S openssl`). On Windows 10 (Anniversary Update or later), just set up and use [Bash on ubuntu on Windows](https://msdn.microsoft.com/en-au/commandline/wsl/about).

**Private key:** `openssl genrsa 1024 > key.pem`  
**Public key:** `openssl req -x509 -new -key key.pem > cert.pem`


# How to deploy on [AWS Lambda](https://aws.amazon.com/lambda/)?

You may consider deploying the project to AWS Lambda if you don't want to manage and provision server resources by yourself. Amazon has made it easy to migrate existing Express apps to Lambda: see [here](https://aws.amazon.com/blogs/aws/running-express-applications-on-aws-lambda-and-amazon-api-gateway/) and the included two links at the end of the article for instructions (you may want to directly modify the transpiled codes for migration as it will be simpler). After the migration, follow instructions [here](http://docs.aws.amazon.com/lambda/latest/dg/nodejs-create-deployment-pkg.html) to create a deployment package before uploading to Lambda through AWS web console.

### **Windows developers beware!**

AWS Lambda functions run as [containers](https://en.wikipedia.org/wiki/Operating-system-level_virtualization) on top of an Amazon Linux system, which means that code files following Windows End-Of-Line format (i.e. `\r\n`) will not be executed correctly on Lambda. Make sure to supply option `--newLine "lf"` to `tsc` if you are going to manually transpile the project. I've already included it in `package.json`, just run
`npm run build` to get the deployment-ready codes.

### Also a note about zipping projects...

For some reason Lambda won't recognize archives zipped by WinZip (at least on Windows); I have to use the `zip` command tool on Unix systems.

* On macOS / Linux: `cd` to the `/build` directory, then do `zip -r -9 [file_name].zip *`.

* On Windows: follow the instructions provided in the *How to generate new certificates for testing?* section to install `MSYS2` first, install the `zip` package by `pacman -S zip`, then run the same command as you would on macOS / Linux.
