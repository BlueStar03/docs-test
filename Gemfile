source "https://rubygems.org"

gem "jekyll", "~> 4.4.1"

# Required for `jekyll serve` on Ruby 3.0+
# (webrick was removed from the stdlib starting in Ruby 3.0)
gem "webrick", "~> 1.8"

group :jekyll_plugins do
  gem "jekyll-feed",    "~> 0.17"
  gem "jekyll-seo-tag", "~> 2.8"
  gem "jekyll-sitemap", "~> 1.4"
  gem "jemoji",         "~> 0.13"
end

# Timezone data for Windows + JRuby
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Faster file-watching on Windows
gem "wdm", "~> 0.1", platforms: [:mingw, :x64_mingw, :mswin]

# JRuby network compatibility
gem "http_parser.rb", "~> 0.6.0", platforms: [:jruby]