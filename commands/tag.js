import { createWriteStream } from 'fs';

import { downloadMediaMessage } from "@whiskeysockets/baileys";

import configManager from '../utils/manageConfigs.js';

export async function tagall(message, client) {

    const remoteJid = message.key.remoteJid;

     if (!remoteJid.includes('@g.us')) {
            await client.sendMessage(remoteJid, { text: '*𝐂𝐎𝐌𝐌𝐀𝐃 𝐌𝐀𝐃𝐄 𝐎𝐍𝐋𝐘 𝐅𝐎𝐑 𝐆𝐑𝐎𝐔𝐏𝐒.*' });
            return;
        }

    try {

        const groupMetadata = await client.groupMetadata(remoteJid);

        const participants = groupMetadata.participants.map(user => user.id);

        const text = participants.map(user => `@${user.split('@')[0]}`).join(' \n');

        await client.sendMessage(remoteJid, {

            text: `𝐆𝐎𝐓𝐀𝐑 𝐓𝐀𝐆𝐀𝐋𝐋🎧\n${text}`,

            mentions: participants
        });

    } catch (error) {

        console.error("_Error mentioning all:_", error);
    }
}

export async function tagadmin(message, client) {

    const remoteJid = message.key.remoteJid;

    const botNumber = client.user.id.split(':')[0] + '@s.whatsapp.net';

    try {

         if (!remoteJid.includes('@g.us')) {
            await client.sendMessage(remoteJid, { text: '*𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐎𝐍𝐋𝐘 𝐅𝐎𝐑 𝐆𝐑𝐎𝐔𝐏𝐒.*' });
            return;
        }

        const { participants } = await client.groupMetadata(remoteJid);

        const admins = participants.filter(p => p.admin && p.id !== botNumber).map(p => p.id);

        if (admins.length === 0) {

            return await client.sendMessage(remoteJid, { text: "❌ No admins found in this group." });
        }
        const text = `👮‍♂️𝐆𝐎𝐓𝐀𝐑 𝐓𝐀𝐆𝐀𝐃𝐌𝐈𝐍𝐒* \n${admins.map(user => `@${user.split('@')[0]}`).join('\n')}`;

        await client.sendMessage(remoteJid, { text, mentions: admins });

    } catch (error) {

        console.error("❌ Error mentioning admins:", error);

        await client.sendMessage(remoteJid, { text: "❌ Error while tagging admins!" });
    }
}

export async function respond(message, client) {

    const number = client.user.id.split(':')[0];

    const remoteJid = message.key.remoteJid;

    const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';

    // Ensure the user exists in config
    if (!configManager.config.users[number]) return;

    const tagRespond = configManager.config.users[number].response;

    if ((!message.key.fromMe) && tagRespond) {

        if (messageBody.includes(`@${number}`)) {

            await client.sendMessage(remoteJid, {

                audio: { url: configManager.config.users[number].tagAudioPath || "tag.mp3" },

                mimetype: "audio/mp4",

                ptt: true,

                contextInfo: { 

                    stanzaId: message.key.id,

                    participant: message.key.participant || remoteJid,

                    quotedMessage: message.message,
                }
            });
        }
    }
}

export async function settag(message, client) {

    const number = client.user.id.split(':')[0];

    try {

        const remoteJid = message.key.remoteJid;

        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quotedMessage || !quotedMessage.audioMessage) {

            return client.sendMessage(remoteJid, { text: "❌ Reply to an audio" });
        }

        const audio = await downloadMediaMessage({ message: quotedMessage }, "stream");

        const filePath = `${number}.mp3`;

        const writeStream = createWriteStream(filePath);

        // Ensure user exists in config and update path
        if (!configManager.config.users[number]) configManager.config.users[number] = {};

        configManager.config.users[number].tagAudioPath = filePath;

        configManager.save(); // Save changes

        audio.pipe(writeStream);

        await client.sendMessage(remoteJid, { text: "_Audio tag has been updated successfully_" });

    } catch (error) {

        console.error("_Error changing the tag audio:_", error);
    }
}export async function tag(message, client) {
    const remoteJid = message.key.remoteJid;

    try {
        if (!remoteJid.includes('@g.us')) {
            await client.sendMessage(remoteJid, { text: '*𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐎𝐍𝐋𝐘 𝐅𝐎𝐑 𝐆𝐑𝐎𝐔𝐏𝐒.*' });
            return;
        }

        // Fetch group metadata
        const groupMetadata = await client.groupMetadata(remoteJid);
        const participants = groupMetadata.participants.map(user => user.id);

        const messageBody = message.message?.conversation || message.message?.extendedTextMessage?.text || "";

        const commandAndArgs = messageBody.slice(1).trim();
        const parts = commandAndArgs.split(/\s+/);
        const text = parts.slice(1).join(' ') || '𝐇𝐄𝐋𝐎 𝐖𝐑𝐋𝐃';

        // Check if the message is quoting another message
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (quotedMessage) {
            // If quoted message is a sticker, forward it
            if (quotedMessage.stickerMessage) {
                const sticker = quotedMessage.stickerMessage;
                await client.sendMessage(remoteJid, { sticker, mentions: participants });
                return;
            }

            // If quoted message is text, reply with mentions
            const quotedText = quotedMessage.conversation || quotedMessage.extendedTextMessage?.text || "";
            await client.sendMessage(remoteJid, { text: `${quotedText}`, mentions: participants });
            return;
        }

        // Default behavior (no quoted message)
        await client.sendMessage(remoteJid, { text: `${text}`, mentions: participants });

    } catch (error) {
        console.error("_Error mentioning all:_", error);
    }
}

export async function tagoption(message, client) {

    const number = client.user.id.split(':')[0];

    const remoteJid = message.key.remoteJid;

    const messageBody = message.message?.conversation || message.message?.extendedTextMessage?.text || "";

    const commandAndArgs = messageBody.slice(1).trim();

    const parts = commandAndArgs.split(/\s+/);

    const args = parts.slice(1);

    if (!configManager.config.users[number]) return;

    try {

        if (args.join(' ').toLowerCase().includes("on")) {

            configManager.config.users[number].response = true;

            configManager.save();

            await client.sendMessage(remoteJid, { text: "*𝐘𝐎𝐔𝐑 𝐓𝐀𝐆 𝐑𝐄𝐒𝐏𝐎𝐍𝐒𝐄 𝐈𝐒 𝐄𝐍𝐀𝐁𝐋𝐄𝐃*" });

        } else if (args.join(' ').toLowerCase().includes("off")) {

            configManager.config.users[number].response = false;

            configManager.save();

            await client.sendMessage(remoteJid, { text: "*𝐘𝐎𝐔𝐑 𝐓𝐀𝐆 𝐑𝐄𝐒𝐏𝐎𝐍𝐒𝐄 𝐈𝐒 𝐃𝐈𝐒𝐀𝐁𝐋𝐄*" });

        } else {

            await client.sendMessage(remoteJid, { text: "*𝐒𝐄𝐋𝐄𝐂𝐓 𝐀𝐍 𝐎𝐏𝐓𝐈𝐎𝐍: 𝐎𝐍/𝐎𝐅𝐅*" });
        }
    } catch (error) {

        console.error("_Error changing the tag audio:_", error);
    }
}



export default { tagall, tagadmin, tagoption, settag, respond, tag };
