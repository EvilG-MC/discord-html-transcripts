import type { GuildMember, Message, User } from "seyfert";
import { ChannelType, UserFlags } from "seyfert/lib/types";
import { convertToHEX } from "./utils";

export type Profile = {
  author: string; // author of the message
  avatar: string | null; // avatar of the author
  roleColor?: string; // role color of the author
  roleIcon?: string; // role color of the author
  roleName?: string; // role name of the author

  bot?: boolean; // is the author a bot
  verified?: boolean; // is the author verified
};

export async function buildProfiles(messages: Message[]) {
  const profiles: Record<string, Profile> = {};

  // loop through messages
  for (const message of messages) {
    // add all users
    const author = message.author;
    if (!profiles[author.id]) {
      // add profile
      profiles[author.id] = await buildProfile(message.member, author);
    }

    // add interaction users
    if (message.interaction) {
      const user = message.author;
      if (!profiles[user.id]) {
        profiles[user.id] = await buildProfile(message.member, user);
      }
    }

    // threads
    if (message.thread && (message.thread.type === ChannelType.PublicThread || message.thread.type === ChannelType.PrivateThread)) {
      const thread = await message.client.messages.fetch(message.thread.id, message.thread.parentId!);

      profiles[thread.author.id] = await buildProfile(
        thread.member,
        thread.author,
      );
    }
  }

  // return as a JSON
  return profiles;
}

async function buildProfile(member: GuildMember | undefined, author: User) {
  return {
    author: author.tag,
    avatar: member?.dynamicAvatarURL({ size: 64 }) ?? author.avatarURL({ size: 64 }),
    roleColor: convertToHEX(author.accentColor ?? undefined),
    roleIcon: (await member?.roles.highest())?.icon ?? undefined,
    roleName: (await member?.roles.highest())?.name ?? undefined,
    bot: author.bot,
    verified: (author.flags ?? 0 & UserFlags.VerifiedBot) === UserFlags.VerifiedBot,
  };
}
