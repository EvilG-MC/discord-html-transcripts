import { DiscordHeader, DiscordMessages as DiscordMessagesComponent } from '@derockdev/discord-components-react';
import React, { Suspense } from 'react';
import type { RenderMessageContext } from '.';
import MessageContent, { RenderType } from './renderers/content';
import DiscordMessage from './renderers/message';
import type { BaseGuildChannel } from 'seyfert';
import { ChannelType } from 'seyfert/lib/types';

/**
 * The core transcript component.
 * Expects window.$discordMessage.profiles to be set for profile information.
 *
 * @param props Messages, channel details, callbacks, etc.
 * @returns
 */
export default async function DiscordMessages({ messages, channel, callbacks, ...options }: RenderMessageContext) {
  const guild = channel.isDM() ? undefined : await (channel as BaseGuildChannel).guild();

  return (
    <DiscordMessagesComponent style={{ minHeight: '100vh' }}>
      {/* header */}
      <DiscordHeader
        guild={channel.isDM() ? 'Direct Messages' : guild?.name}
        channel={
          channel.isDM()
            ? channel.type === ChannelType.DM
              ? channel.recipients?.[0].globalName ?? 'Unknown Recipient'
              : 'Unknown Recipient'
            : (channel as BaseGuildChannel).name
        }
        icon={channel.isDM() ? undefined : guild?.iconURL({ size: 128 }) ?? undefined}
      >
        {channel.isThread() ? (
          `Thread channel in ${channel.name ?? 'Unknown Channel'}`
        ) : channel.isDM() ? (
          `Direct Messages`
        ) : channel.isVoice() ? (
          `Voice Text Channel for ${channel.name}`
        ) : channel.type === ChannelType.GuildCategory ? (
          `Category Channel`
        ) : 'topic' in channel && channel.topic ? (
          <MessageContent
            content={channel.topic}
            context={{ messages, channel, callbacks, type: RenderType.REPLY, ...options }}
          />
        ) : (
          `This is the start of #${(channel as BaseGuildChannel).name} channel.`
        )}
      </DiscordHeader>

      {/* body */}
      <Suspense>
        {messages.map((message) => (
          <DiscordMessage message={message} context={{ messages, channel, callbacks, ...options }} key={message.id} />
        ))}
      </Suspense>

      {/* footer */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        {options.footerText
          ? options.footerText
              .replaceAll('{number}', messages.length.toString())
              .replace('{s}', messages.length > 1 ? 's' : '')
          : `Exported ${messages.length} message${messages.length > 1 ? 's' : ''}.`}{' '}
        {options.poweredBy ? (
          <span style={{ textAlign: 'center' }}>
            Powered by{' '}
            <a href="https://github.com/EvilG-MC/discord-html-transcripts" style={{ color: 'lightblue' }}>
              discord-html-transcripts
            </a>
            .
          </span>
        ) : null}
      </div>
    </DiscordMessagesComponent>
  );
}
