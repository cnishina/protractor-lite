# The WORKSPACE file tells Bazel that this directory is a "workspace", which is like a project root.
# The content of this file specifies all the external dependencies Bazel needs to perform a build.

####################################
workspace(name = "protractor_lite")

git_repository(
    name = "build_bazel_rules_nodejs",
    remote = "https://github.com/bazelbuild/rules_nodejs.git",
    tag = "0.16.0", # check for the latest tag when you install
)

#####################################

load("@build_bazel_rules_nodejs//:package.bzl", "rules_nodejs_dependencies")
rules_nodejs_dependencies()

