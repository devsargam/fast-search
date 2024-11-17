const Typesense = require("typesense");
const axios = require("axios");
require("dotenv/config");

const {
  GITHUB_USERNAME,
  GITHUB_TOKEN,
  TYPESENSE_HOST,
  TYPESENSE_PORT,
  TYPESENSE_PROTOCOL,
  TYPESENSE_API_KEY,
} = process.env;

const TYPESENSE_CONFIG = {
  nodes: [
    {
      host: TYPESENSE_HOST,
      port: Number(TYPESENSE_PORT),
      protocol: TYPESENSE_PROTOCOL,
    },
  ],
  apiKey: TYPESENSE_API_KEY,
  connectionTimeoutSeconds: 2,
};

// Initialize Typesense client
const typesenseClient = new Typesense.Client(TYPESENSE_CONFIG);

// GitHub API endpoint
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/followers?per_page=100`;

async function setupCollection() {
  try {
    // Delete collection if it already exists (optional)
    try {
      await typesenseClient.collections("github_followers").delete();
      console.log("Existing collection deleted.");
    } catch (error) {
      console.log("No existing collection to delete.");
    }

    // Create a new collection
    await typesenseClient.collections().create({
      name: "github_followers",
      fields: [
        { name: "id", type: "string" },
        { name: "login", type: "string" },
        { name: "avatar_url", type: "string" },
        { name: "html_url", type: "string" },
      ],
    });

    console.log("Collection created.");
  } catch (error) {
    console.error("Error setting up collection:", error);
  }
}

async function fetchFollowers() {
  try {
    const followers = [];
    for (let i = 1; i <= 10; i++) {
      const response = await axios.get(`${GITHUB_API_URL}&page=${i}`, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      });

      followers.push(...response.data);
    }

    console.log(followers);

    // Map followers to the Typesense schema
    return followers.map((follower) => ({
      id: String(follower.id),
      login: follower.login,
      avatar_url: follower.avatar_url,
      html_url: follower.html_url,
    }));
  } catch (error) {
    console.error(
      "GitHub API error:",
      error.response?.statusText || error.message
    );
    throw error;
  }
}

async function insertFollowersIntoTypesense(followers) {
  try {
    const result = await typesenseClient
      .collections("github_followers")
      .documents()
      .import(followers);

    console.log("Followers inserted into Typesense:", result);
  } catch (error) {
    console.error("Error inserting followers:", error);
  }
}

(async function main() {
  try {
    console.log("Setting up Typesense collection...");
    await setupCollection();

    console.log("Fetching GitHub followers...");
    const followers = await fetchFollowers();

    console.log(`Fetched ${followers.length} followers.`);

    console.log("Inserting followers into Typesense...");
    await insertFollowersIntoTypesense(followers);

    console.log("Done!");
  } catch (error) {
    console.error("Error in main script:", error);
  }
})();
