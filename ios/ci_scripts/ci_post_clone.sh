#!/bin/sh

#  ci_post_clone.sh
#  RocketChatRN
#
#  Created by Sven Anderson on 09.04.23.

set -ex

export HOMEBREW_NO_INSTALL_CLEANUP=TRUE

for i in GOOGLE_API_KEY BUGSNAG_API_KEY; do
  sed -i "" "s/__${i}__/${!i}/g" $(git grep -l __${i}__ -- :/ )
done

brew install ruby@3.1
brew link ruby@3.1

gem install cocoapods
#brew install cocoapods

export PATH=$(gem env home)/bin:$PATH

# have to add node yourself
brew install node@16
# link it to the path
brew link node@16

brew install yarn

# Install dependencies you manage with CocoaPods.
yarn
pod install
