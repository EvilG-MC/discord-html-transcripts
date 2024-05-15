import {
  DiscordEmbed as DiscordEmbedComponent,
  DiscordEmbedDescription,
  DiscordEmbedField,
  DiscordEmbedFields,
  DiscordEmbedFooter,
} from '@derockdev/discord-components-react';
import React from 'react';
import type { RenderMessageContext } from '..';
import { calculateInlineIndex } from '../../utils/embeds';
import MessageContent, { RenderType } from './content';
import type { Message } from 'seyfert';
import type{ APIEmbed } from 'seyfert/lib/types';

type RenderEmbedContext = RenderMessageContext & {
  index: number;
  message: Message;
};

export async function DiscordEmbed({ embed, context }: { embed: APIEmbed; context: RenderEmbedContext }) {
  

  return (
    <DiscordEmbedComponent
      embedTitle={embed.title}
      slot="embeds"
      key={`${context.message.id}-e-${context.index}`}
      authorImage={embed.author?.proxy_icon_url ?? embed.author?.icon_url}
      authorName={embed.author?.name}
      authorUrl={embed.author?.url}
      color={`#${embed.color?.toString(16).padStart(6, '0')}` ?? undefined}
      image={embed.image?.proxy_url ?? embed.image?.url}
      thumbnail={embed.thumbnail?.proxy_url ?? embed.thumbnail?.url}
      url={embed.url}
    >
      {/* Description */}
      {embed.description && (
        <DiscordEmbedDescription slot="description">
          <MessageContent content={embed.description} context={{ ...context, type: RenderType.EMBED }} />
        </DiscordEmbedDescription>
      )}

      {/* Fields */}
      {embed.fields && embed.fields.length > 0 && (
        <DiscordEmbedFields slot="fields">
          {embed.fields.map(async (field, id) => (
            <DiscordEmbedField
              key={`${context.message.id}-e-${context.index}-f-${id}`}
              fieldTitle={field.name}
              inline={field.inline}
              inlineIndex={calculateInlineIndex(embed.fields!, id)}
            >
              <MessageContent content={field.value} context={{ ...context, type: RenderType.EMBED }} />
            </DiscordEmbedField>
          ))}
        </DiscordEmbedFields>
      )}

      {/* Footer */}
      {embed.footer && (
        <DiscordEmbedFooter
          slot="footer"
          footerImage={embed.footer.proxy_icon_url ?? embed.footer.icon_url}
          timestamp={embed.timestamp ?? undefined}
        >
          {embed.footer.text}
        </DiscordEmbedFooter>
      )}
    </DiscordEmbedComponent>
  );
}
