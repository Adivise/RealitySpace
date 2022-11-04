module.exports = {
    TOKEN: [ /// You can add token bot (unlimited) if you want!
      "TOKEN_01", 
      "TOKEN_02", 
      "TOKEN_03",
      "TOKEN_04",
      "TOKEN_05",
      "TOKEN_06",
      "TOKEN_07",
      "TOKEN_08",
      "TOKEN_09",
      "TOKEN_10"
    ],
    PREFIX: [ /// Prefix bot need same count with token
      "01.", 
      "02.", 
      "03.",
      "04.",
      "05.",
      "06.",
      "07.",
      "08.",
      "09.",
      "10."
    ],
    EMBED_COLOR: "#000001", //<= default is "#000001"
    OWNER_ID: "515490955801919488", //your owner discord id example: "515490955801919488"
    DEV_ID: [], // if you want to use bot only as you, you can put your id here example: ["123456789", "123456789"]
    LEAVE_EMPTY: 120000, // 2 minutes
    DEFAULT_SEARCH: "ytsearch", // default search engine & "ytmsearch" / "ytsearch" / "scsearch" / "spsearch"
    NODES: [ /// Requirement 1 Nodes for this project!
      {
        identifier: "NanoSpace",
        host: "localhost",
        port: 5555,
        password: "nanospace",
        retryAmount: 10,
        retryDelay: 7500,
        secure: false
      }
    ],
}