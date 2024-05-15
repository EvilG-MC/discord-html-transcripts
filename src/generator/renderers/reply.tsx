import { DiscordReply } from '@derockdev/discord-components-react';
import type { RenderMessageContext } from '..';
import React from 'react';
import MessageContent, { RenderType } from './content';
import type { Message } from 'seyfert';
import { UserFlags } from 'seyfert/lib/types';

export default async function MessageReply({ message, context }: { message: Message; context: RenderMessageContext }) {
  const guild = await message.guild();
  
  if (!message.messageReference) return null;
  if (message.messageReference.channelId !== message.channelId) return null;

  const referencedMessage = context.messages.find((m) => m.id === message.messageReference!.messageId);
  if (!referencedMessage) return <DiscordReply slot="reply">Message could not be loaded.</DiscordReply>;
  
  const channel = await message.channel();

  const isCrosspost = referencedMessage.messageReference && referencedMessage.messageReference.guildId !== guild?.id;
  const isCommand = !!referencedMessage.interaction;
  
  return (
    <DiscordReply
      slot="reply"
      edited={!isCommand && referencedMessage.editedTimestamp !== null}
      attachment={referencedMessage.attachments.length > 0}
      author={referencedMessage.author.tag}
      avatar={referencedMessage.author.avatarURL({ size: 32 }) ?? undefined}
      roleColor={`#${referencedMessage.author.accentColor?.toString(16).padStart(6, '0')}`}
      bot={!isCrosspost && referencedMessage.author.bot}
      verified={referencedMessage.author.flags && (referencedMessage.author.flags & UserFlags.VerifiedBot) === UserFlags.VerifiedBot}
      op={channel.isThread() && referencedMessage.author.id === channel.ownerId}
      server={isCrosspost ?? undefined}
      command={isCommand}
    >
      {referencedMessage.content ? (
        <span data-goto={referencedMessage.id}>
          <MessageContent content={referencedMessage.content} context={{ ...context, type: RenderType.REPLY }} />
        </span>
      ) : isCommand ? (
        <em data-goto={referencedMessage.id}>Click to see command.</em>
      ) : (
        <em data-goto={referencedMessage.id}>Click to see attachment.</em>
      )}
    </DiscordReply>
  );
}
