import { DiscordReaction, DiscordReactions, DiscordSystemMessage } from '@derockdev/discord-components-react';
import React from 'react';
import { convertToHEX, parseDiscordEmoji } from '../../utils/utils';
import { MessageType } from 'seyfert/lib/types';
import type { GuildMember, Message, User } from 'seyfert';

export default async function SystemMessage({ message }: { message: Message }) {
  const highestRole = await message.member?.roles.highest();
  
  switch (message.type) {
    case MessageType.RecipientAdd:
    case MessageType.UserJoin:
      return (
        <DiscordSystemMessage id={`m-${message.id}`} key={message.id} type="join">
          <JoinMessage member={message.member ?? null} fallbackUser={message.author} />
        </DiscordSystemMessage>
      );

    case MessageType.ChannelPinnedMessage:
      return (
        <DiscordSystemMessage id={`m-${message.id}`} key={message.id} type="pin">
          <Highlight color={convertToHEX((highestRole?.color))}>
            {message.author.tag}
          </Highlight>{' '}
          pinned <i data-goto={message.messageReference?.messageId}>a message</i> to this channel.
          {/* reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <DiscordReactions slot="reactions">
              {message.reactions.map((reaction, id) => (
                <DiscordReaction
                  key={`${message.id}r${id}`}
                  name={reaction.emoji.name!}
                  emoji={parseDiscordEmoji(reaction.emoji)}
                  count={reaction.count}
                />
              ))}
            </DiscordReactions>
          )}
        </DiscordSystemMessage>
      );

    case MessageType.GuildBoost:
    case MessageType.GuildBoostTier1:
    case MessageType.GuildBoostTier2:
    case MessageType.GuildBoostTier3:
      return (
        <DiscordSystemMessage id={`m-${message.id}`} key={message.id} type="boost">
          <Highlight color={convertToHEX(highestRole?.color)}>
            {message.author.tag}
          </Highlight>{' '}
          boosted the server!
        </DiscordSystemMessage>
      );

    case MessageType.ThreadStarterMessage:
      return (
        <DiscordSystemMessage id={`ms-${message.id}`} key={message.id} type="thread">
          <Highlight color={convertToHEX(highestRole?.color)}>
            {message.author.tag}
          </Highlight>{' '}
          started a thread: <i data-goto={message.messageReference?.messageId}>{message.content}</i>
        </DiscordSystemMessage>
      );

    default:
      return undefined;
  }
}

export function Highlight({ children, color }: { children: React.ReactNode; color?: string }) {
  return <i style={{ color: color ?? 'white' }}>{children}</i>;
}

const allJoinMessages = [
  '{user} just joined the server - glhf!',
  '{user} just joined. Everyone, look busy!',
  '{user} just joined. Can I get a heal?',
  '{user} joined your party.',
  '{user} joined. You must construct additional pylons.',
  'Ermagherd. {user} is here.',
  'Welcome, {user}. Stay awhile and listen.',
  'Welcome, {user}. We were expecting you ( ͡° ͜ʖ ͡°)',
  'Welcome, {user}. We hope you brought pizza.',
  'Welcome {user}. Leave your weapons by the door.',
  'A wild {user} appeared.',
  'Swoooosh. {user} just landed.',
  'Brace yourselves {user} just joined the server.',
  '{user} just joined. Hide your bananas.',
  '{user} just arrived. Seems OP - please nerf.',
  '{user} just slid into the server.',
  'A {user} has spawned in the server.',
  'Big {user} showed up!',
  "Where's {user}? In the server!",
  '{user} hopped into the server. Kangaroo!!',
  '{user} just showed up. Hold my beer.',
  'Challenger approaching - {user} has appeared!',
  "It's a bird! It's a plane! Nevermind, it's just {user}.",
  "It's {user}! Praise the sun! \\\\[T]/",
  'Never gonna give {user} up. Never gonna let {user} down.',
  'Ha! {user} has joined! You activated my trap card!',
  'Cheers, love! {user} is here!',
  'Hey! Listen! {user} has joined!',
  "We've been expecting you {user}",
  "It's dangerous to go alone, take {user}!",
  "{user} has joined the server! It's super effective!",
  'Cheers, love! {user} is here!',
  '{user} is here, as the prophecy foretold.',
  "{user} has arrived. Party's over.",
  'Ready player {user}',
  '{user} is here to kick butt and chew bubblegum. And {user} is all out of gum.',
  "Hello. Is it {user} you're looking for?",
];

export async function JoinMessage({ member, fallbackUser }: { member: GuildMember | null; fallbackUser: User }) {
  const randomMessage = allJoinMessages[Math.floor(Math.random() * allJoinMessages.length)];
  const highestRole = await member?.roles.highest();

  return randomMessage
    .split('{user}')
    .flatMap((item, i) => [
      item,
      <Highlight color={convertToHEX(highestRole?.color)} key={i}>
        {member?.user.tag ?? fallbackUser.tag}
      </Highlight>,
    ])
    .slice(0, -1);
}
