const { Octokit } = require("@octokit/action");

const main = async () => {
  try {
    const octokit = new Octokit();
    const tag = process.env.RELEASE_TAG;
    const message = `Fleet Weekly Release - ${tag}`;
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
    const branch = process.env.GITHUB_REF.replace("/refs/heads/", "");
    const object = process.env.GITHUB_SHA;

    // See https://docs.github.com/en/rest/git/tags#create-a-tag-object
    await octokit.request(
      "POST /repos/{owner}/{repo}/git/tags",
      {
        owner,
        repo,
        tag,
        message,
        object,
        type: "commit",
      }
    );

    // See https://docs.github.com/en/rest/releases/releases#create-a-release
    await octokit.request('POST /repos/{owner}/{repo}/releases', {
      owner,
      repo,
      tag_name: tag,
      target_commitish: branch,
      name: message,
      body: '# Description of the release',
      draft: false,
      prerelease: false,
      generate_release_notes: true
    })
  } catch (e) {
    console.log(e);
  }
};

main();
