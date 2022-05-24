const { Octokit } = require("@octokit/action");

const main = async () => {
  try {
    const octokit = new Octokit();
    const tag = process.env.RELEASE_TAG;
    const pull_number = process.env.PR_NUMBER;
    const message = `Fleet Weekly Release - ${tag}`;
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
    const branch = process.env.GITHUB_REF.replace("/refs/heads/", "");
    const object = process.env.GITHUB_SHA;

    // // See https://docs.github.com/en/rest/git/tags#create-a-tag-object
    // await octokit.request(
    //   "POST /repos/{owner}/{repo}/git/tags",
    //   {
    //     owner,
    //     repo,
    //     tag,
    //     message,
    //     object,
    //     type: "commit",
    //   }
    // );
    // const release_tag = process.env.RELEASE_TAG
    // const date = release_tag.split('@')[1];
    // const encoded_release_tag = release_tag.replace('@', '%40');
    // const headline = `Fleet App scheduled production release on ${date} - 2PM Pacific.`
    // const release_link = `https://github.com/nauto/web-apps/releases/tag/${encoded_release_tag}`
    // const payload = JSON.stringify({
    //  headline,
    //  release_link
    // });
  
      const commits = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/commits', {
        owner,
        repo,
        pull_number,
      })

      const tickets = commits.reduce((acc, data) => {
        const message = data.commit.message;
        const regex = /(DRT|NAUTO)-(\(|\)|\d{5})/g;
          const ticket = message.match(regex);
          if(ticket){
            acc.push(ticket[0])
          }
        return acc;
      },[])

      console.log('tickets', tickets)
  
      // const jiraRelease = 


    // await new Promise((resolve, reject) => {
    //   exec(
    //     `curl -X POST -H 'Content-type: application/json' --data '${payload}' ${process.env.FLEET_RELEASE_SLACK_WEBHOOK}`,
    //     (err, stdout, stdErr) => {
    //       if (err || stdErr) {
    //         reject(err || stdErr);
    //       }
    //       resolve(stdout);
    //     },
    //   );
    // });
  } catch (e) {
    console.log(e);
  }
};

main();
