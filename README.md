# sharetribe.com marketing site

The marketing site shown at www.sharetribe.com

## Getting started

### Setting up the dev environment

**Prerequisites:** git, node, npm

```bash
git clone git@github.com:sharetribe/marketing-site.git
cd marketing-site
npm install -g grunt-cli
npm install # This will download the whole internet, so be patient
```

Setup `aws-keys.json` (scroll down for more info)

### Development

Run

```bash
grunt dev
```

...to start a local server on port 8888. Open URL http://localhost:8888 to access the site.

This task also watches changed in SCSS files and auto-compiles new CSS files and refreshes your browser when a change occures.

## Deploy

### Build, package and deploy new version (Staging)

_tl;dr Run `grunt deploy-staging`_

(Make sure you have `aws-keys.json` file)

Test before deploy:

1. Run `grunt build test`

1. Build task creates a new folder `dist`. Run `grunt test` to test the `dist` folder in http://localhost:8889.

Deploy:

1. Run `grunt deploy-staging`

1. Go to S3 URL (http://www.sharetri.be.s3-website-us-east-1.amazonaws.com/ or http://www.sharetribe.com.s3-website-us-east-1.amazonaws.com/) and test.

1. Go to [CloudFront console](https://console.aws.amazon.com/cloudfront/home), click the distribution to see the details and select `Invalidations` tab. Now invalidate all HTML files. The easiest way to do this is to locate a previous invalidation task, which invalidated all the HTML files and click `Copy`.

1. Make sure the cache is invalidated: Open the browser and go to the site URL. See the source code. Scroll to the bottom and make sure the VERSION is updated.


### Production deployment

_tl;dr Run `grunt deploy-prod`_

So it's the same as with staging except that you run deploy-prod.
You then need to make sure you invalidate the content in
correct CloudFront distribution (the one with comment talking about
production site).


### AWS Credentials

**If you are only developing, and do not need the AWS access** you must create an empty `aws-keys.json` file. This command should do the trick

```bash
echo '{}' >> aws-keys.json
```

**If you are doing a deploy**, create a new file called `aws-keys.json`. The content of that file should be:

```json
  {
    "AWSAccessKeyId": "AKxxxxxxxxxx",
    "AWSSecretKey": "super-secret-key"
  }
```

## Setup

1. http://docs.aws.amazon.com/gettingstarted/latest/swh/setting-up.html
