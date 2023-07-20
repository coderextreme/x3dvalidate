#!/usr/bin/perl
use strict;
use warnings;
use v5.10.0;
use utf8;
use open qw/:std :utf8/;

my $version = `npm pkg get version | sed 's/"//g'`;
chomp $version;
say "package.json version $version";

my $online = `npm view x3dvalidate version`;
chomp $online;
say "NPM version $online";

system "npm version patch --no-git-tag-version --force" if $version eq $online;
system "npm i x3dvalidate\@latest";

system "git", "add", "-A";
system "git", "commit", "-am", "Published version $version";
system "git", "push", "origin";

system "npm", "publish";
