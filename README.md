## 📑 Feature
- [x] Music System
- [x] Custom Filters
- [x] Multi Instnaces Support
- [x] Easy to use

## 🎶 Support Source
- [x] Youtube
- [x] SoundCloud
- [x] Spotify
- [x] Deezer
- [x] Facebook 
- [x] Twitch
- [x] Apple
- [x] Bandcamp
- [x] Vimeo
- [x] Https (Radio)

<details><summary>📎 Requirements [CLICK ME]</summary>
<p>

## 📎 Requirements

- Node.js+ **[Download](https://nodejs.org/en/download/)**
- Discord Bot Token **[Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**
- LavaLink **[Guide](https://github.com/freyacodes/lavalink)** (*Dev Version!* **[Download](https://ci.fredboat.com/repository/downloadAll/Lavalink_Build/9311:id/artifacts.zip)** )

## 🛑 Super Requirements 

- Java 11-13 **[Download JDK13](http://www.mediafire.com/file/m6gk7aoq96db8g0/file)** (i use this version) for LAVALINK!

</p>
</details>

## 📚 Installation

```
git clone https://github.com/Adivise/NanoSpace
cd NanoSpace
npm install
```

<details><summary>📄 Configuration [CLICK ME]</summary>
<p>

## 📄 Configuration

Copy or Rename `config.js.example` to `config.js` and fill out the values:

```js
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
        password: "123456",
        retryAmount: 10,
        retryDelay: 7500,
        secure: false
      }
    ],
}
```
	
After installation or finishes all you can use `node .` to start the bot. or `Run Start.bat`

</p>
</details>

<details><summary>🔩 Features & Commands [CLICK ME]</summary>
<p>

## 🔩 Features & Commands

> Note: The default prefix is '#'

🎶 **Music Commands!** 

- Play (#play, #p, #pplay [song/url])
- Nowplaying (#nowplaying, #np, #now)
- Queue (#queue <page>)
- Repeat (#loop (current, all), #repeat (current, all))
- Loopqueue (#loopall, #lq, repeatall)
- Shuffle (#shuffle, mix)
- Volume control (#vol, #v [10 - 100])
- Pause (#pause, #pa)
- Resume (#resume, #r)
- Skip (#skip, #s)
- Skipto (#skipto, #st [position])
- Clear (#clear)
- Join (#join, #summon)
- Leave (#leave, #dc, #lev, #stop)
- Forward (#forward <second>)
- Seek (#seek <second>)
- Rewind (#rewind <second>)
- Replay (#replay)
- Search (#search [songname])
- 247 (#247)
- Previous (#previous)
- Autoplay (#autoplay)
- Move (#move [song] [position])
- Remove (#remove [song])
- PlaySkip (#playskip [song/url])
- SearchSkip (#searchskip [songname])
- PlayTop (#playtop [song/url])
- SearchTop (#searchtop [songname])

⏺ **Filter Commands!**
- Bass (#bass)
- Superbass (#superbass, #sb)
- Pop (#pop)
- Treblebass (#treblebass, #tb)
- Soft (#soft)
- Earrape (#earrape, #ear)
- Equalizer (#eq <custom>)
- Speed (#speed <amount>)
- Picth (#pitch <amount>)
- Vaporwave (#vaporwave)
- Nightcore (#nightcore)
- Bassboost (#bassboost, #bb [-10 - 10])
- Rate (#rate)
- Reset (#reset)
- 3d (#3d)
- China (#china)
- Dance (#dance)
- Chipmunk (#chipmunk)
- Darthvader (#darthvader)
- DoubleTime (#doubletime)
- SlowMotion (#slowmotion)
- Tremolo (#tremolo)
- Vibrate (#vibrate)
- Vibrato (#vibrato)
- Daycore (#daycore)
- Television (#Television)
- Jazz (#jazz)
	
📑 **Misc Commands!**
- Help (#help, #halp [command])
- Vps (#vps)
- LavaLink (#lavalink)

🤖 **Dev Commands!**
- Whitelist (#whitelist [add/remove] <guildId>)
- LeaveGuilds (#leaveguild)
- GuildLists (#guildlist)

</p>
</details>
