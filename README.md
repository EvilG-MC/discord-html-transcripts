# `discord-html-transcripts`

> A modified version of: [discord-html-transcripts](https://github.com/ItzDerock/discord-html-transcripts)
> With the only purpose to make this works with [Seyfert](https://github.com/tiramisulabs/seyfert)

![GitHub package.json version](https://img.shields.io/github/package-json/v/EvilG-MC/discord-html-transcripts)
![GitHub Repo stars](https://img.shields.io/github/stars/EvilG-MC/discord-html-transcripts?style=social)

Discord HTML Transcripts is a node.js module to generate nice looking HTML transcripts. Processes discord markdown like **bold**, _italics_, ~~strikethroughs~~, and more. Nicely formats attachments and embeds. Built in XSS protection, preventing users from inserting arbitrary html tags.

This module can format the following:

- Discord flavored markdown
  - Uses [discord-markdown-parser](https://github.com/ItzDerock/discord-markdown-parser)
  - Allows for complex markdown syntax to be parsed properly
- Embeds
- System messages
  - Join messages
  - Message Pins
  - Boost messages
- Slash commands
  - Will show the name of the command in the same style as Discord
- Buttons
- Reactions
- Attachments
  - Images, videos, audio, and generic files
- Replies
- Mentions
- Threads

Styles from [@derockdev/discord-components](https://github.com/ItzDerock/discord-components).  
Behind the scenes, this package uses React SSR to generate a static site.

## 👋 Support

At the moment, create a [issue](https://github.com/EvilG-MC/discord-html-transcripts/issues/new)
To get support or create a [pull request](https://github.com/EvilG-MC/discord-html-transcripts/pulls) to add new features.

## 🖨️ Example Output

![output](https://derock.media/r/6G6FIl.gif)

## 📝 Usage

### Example usage using the built in message fetcher.

```ts
import { createTranscript } from 'discord-html-transcripts';

const channel = ctx.channel(); // or however you get your text channel
if (!channel?.isTextGuild()) return;

// Must be awaited
const transcript = await createTranscript(channel);

await channel.messages.write({ files: [transcript] });
```

### Or if you prefer, you can pass in your own messages.

```js
import { createTranscript } from 'discord-html-transcripts';

const messages = someWayToGetMessages(); // Must be Message[]
const channel = someWayToGetChannel(); // Used for ticket name, guild icon, and guild name

// Must be awaited
const transcript = await generateFromMessages(messages, channel);

await channel.messages.write({ files: [transcript] });
```

## ⚙️ Configuration

Both methods of generating a transcript allow for an option object as the last parameter.  
**All configuration options are optional!**

### Built in Message Fetcher

```js
const transcript = await createTranscript(channel, {
    limit: -1, // Max amount of messages to fetch. `-1` recursively fetches.
    returnType: 'attachment', // Valid options: 'buffer' | 'string' | 'attachment' Default: 'attachment' OR use the enum ExportReturnType
    filename: 'transcript.html', // Only valid with returnType is 'attachment'. Name of attachment.
    saveImages: false, // Download all images and include the image data in the HTML (allows viewing the image even after it has been deleted) (! WILL INCREASE FILE SIZE !)
    footerText: "Exported {number} message{s}", // Change text at footer, don't forget to put {number} to show how much messages got exported, and {s} for plural
    callbacks: {
      // register custom callbacks for the following:
      resolveChannel: (channelId: string) => Awaitable<AllChannels | null>,
      resolveUser: (userId: string) => Awaitable<User | null>,
      resolveRole: (roleId: string) => Awaitable<GuildRole | null>
    },
    poweredBy: true, // Whether to include the "Powered by discord-html-transcripts" footer
    hydrate: true // Whether to hydrate the html server-side
});
```

### Providing your own messages

```js
const transcript = await generateFromMessages(messages, channel, {
  // Same as createTranscript, except no limit
});
```

## 🤝 Enjoy the package?

Give it a star ⭐ and/or support the original author on [ko-fi](https://ko-fi.com/derock)
