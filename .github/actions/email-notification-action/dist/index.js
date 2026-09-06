/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 9407:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.run = run;
const core = __importStar(__nccwpck_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@actions/core'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
const nodemailer_1 = __importDefault(__nccwpck_require__(1935));
async function run() {
    try {
        const smtpServer = core.getInput('smtp_server', { required: true });
        const smtpPort = core.getInput('smtp_port', { required: true });
        const username = core.getInput('username', { required: true });
        const password = core.getInput('password', { required: true });
        const to = core.getInput('to', { required: true });
        const from = core.getInput('from', { required: true });
        const subject = core.getInput('subject', { required: true });
        const workflowName = core.getInput('workflow_name', { required: true });
        const branch = core.getInput('branch', { required: true });
        const authorName = core.getInput('author_name') || 'N/A';
        const authorEmail = core.getInput('author_email') || 'N/A';
        const runUrl = core.getInput('run_url') || `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;
        const errorMessage = core.getInput('error_message') || '';
        const transporter = nodemailer_1.default.createTransport({
            host: smtpServer,
            port: parseInt(smtpPort, 10),
            secure: smtpPort === '465',
            auth: {
                user: username,
                pass: password
            }
        });
        let body = `
O pipeline de CI/CD falhou. Por favor, verifique os logs no GitHub Actions.
📌 Workflow: ${workflowName}
📌 Repositório: ${process.env.GITHUB_REPOSITORY}
📌 Branch: ${branch}
📌 Autor: ${authorName}`;
        if (authorEmail && authorEmail !== 'N/A') {
            body += ` - ${authorEmail}`;
        }
        body += `\n🔗 Logs: ${runUrl}`;
        body += `\n⏰ Timestamp: ${new Date().toISOString()}`;
        if (errorMessage) {
            body += `\n\n❌ Erro: ${errorMessage}`;
        }
        core.info('Sending email notification...');
        const info = await transporter.sendMail({
            from,
            to,
            subject,
            text: body
        });
        core.info(`Email sent: ${info.messageId}`);
        core.setOutput('messageId', info.messageId);
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(`Action failed with error: ${error.message}`);
        }
        else {
            core.setFailed('Action failed with an unknown error.');
        }
    }
}
if (require.main === require.cache[eval('__filename')]) {
    run();
}


/***/ }),

/***/ 1421:
/***/ ((module) => {

module.exports = require("node:child_process");

/***/ }),

/***/ 7598:
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ 610:
/***/ ((module) => {

module.exports = require("node:dns");

/***/ }),

/***/ 8474:
/***/ ((module) => {

module.exports = require("node:events");

/***/ }),

/***/ 3024:
/***/ ((module) => {

module.exports = require("node:fs");

/***/ }),

/***/ 7067:
/***/ ((module) => {

module.exports = require("node:http");

/***/ }),

/***/ 4708:
/***/ ((module) => {

module.exports = require("node:https");

/***/ }),

/***/ 7030:
/***/ ((module) => {

module.exports = require("node:net");

/***/ }),

/***/ 8161:
/***/ ((module) => {

module.exports = require("node:os");

/***/ }),

/***/ 6760:
/***/ ((module) => {

module.exports = require("node:path");

/***/ }),

/***/ 7075:
/***/ ((module) => {

module.exports = require("node:stream");

/***/ }),

/***/ 1692:
/***/ ((module) => {

module.exports = require("node:tls");

/***/ }),

/***/ 3136:
/***/ ((module) => {

module.exports = require("node:url");

/***/ }),

/***/ 7975:
/***/ ((module) => {

module.exports = require("node:util");

/***/ }),

/***/ 8522:
/***/ ((module) => {

module.exports = require("node:zlib");

/***/ }),

/***/ 2315:
/***/ ((module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = addressparser;
/**
 * Restores the quoting of a local part that was read out of a quoted string.
 *
 * RFC 5321 allows '@' inside a quoted local part, so handing '"user@evil.com"@good.com'
 * on as the bare 'user@evil.com@good.com' leaves it to the consumer which '@' splits the
 * domain off. Getting that wrong is a misrouting vector, so the quotes go back on. The
 * same holds for the other specials: a ',' or a ';' that loses its quotes reads as a
 * recipient separator once the consumer puts the address back into a header.
 *
 * This module has no dependencies so that it can ship on its own, which is why the two
 * grammar tests below are spelled out here instead of shared with src/mime-node. Keeping
 * only what is ambiguous quoted is deliberate, mime-node applies the stricter RFC 5321
 * dot-atom rule on top of this when it emits an address.
 *
 * @param address Address with an unquoted local part
 * @return Address with the local part as a quoted-string
 */
function _quoteLocalPart(address) {
    const lastAt = address.lastIndexOf('@');
    if (lastAt < 0) {
        // no domain to split off, nothing can be misrouted
        return address;
    }
    const user = address.substr(0, lastAt);
    if (/^[^\s"(),:;<>@[\\\]]+$/.test(user) || /^"(?:[^"\\]|\\[\s\S])*"$/.test(user)) {
        // a local part that carries no special reads the same with or without the quotes,
        // and one that is already a complete quoted-string needs nothing either
        return address;
    }
    return '"' + user.replace(/["\\]/g, '\\$&') + '"@' + address.substr(lastAt + 1);
}
/**
 * Reached for every parsed address, so it is built once rather than per call.
 */
const HAS_WHITESPACE = /\s/;
/**
 * An addr-spec that carries its whitespace legally, inside a quoted local part. The
 * optional tail is the malformed shape: a real mailbox with wreckage trailing it.
 */
const QUOTED_LOCAL_ADDR = /^("(?:[^"\\]|\\[\s\S])*"@\S+)(?:\s+([\s\S]+))?$/;
/**
 * One run holding a single '@' and no whitespace, the shape an addr-spec has to have.
 */
const ADDR_SPEC = /^[^@\s]+@[^@\s]+$/;
/**
 * The looser reading applied once the strict one finds nothing, which tolerates the
 * further '@' that a domain should not have but malformed headers carry anyway.
 */
const LOOSE_ADDR_SPEC = /^[^@\s]+@\S+$/;
/**
 * Recovers the addr-spec from an angle-addr that came back holding unquoted whitespace.
 *
 * A malformed header can put more than a mailbox between the angle brackets, most often
 * because the generator wrote the recipient twice: '<user@example.com user@example.com>'
 * or '<example.com user@example.com>'. Whitespace is not addr-spec, so the whole run can
 * never be a mailbox anyone could deliver to, and passing it on as the address loses the
 * recipient that is sitting right there in the header.
 *
 * The run that still reads as an addr-spec is kept and whatever is left over becomes
 * display text rather than being dropped. Candidates are read strictly first and then
 * under the looser grammar, the same two tiers the unquoted-text branch below applies to
 * the same problem, so that '<a@b@c.com junk>' and a bare 'a@b@c.com junk' agree on the
 * recipient. When several runs qualify the first wins, which is what that branch's looser
 * tier does within a token.
 *
 * A quoted local part is left alone: RFC 5321 allows whitespace inside it, so
 * '<"user name"@example.com>' is well formed and means exactly what it says.
 *
 * @param data Collected address parts, mutated in place
 */
function _recoverAddrSpec(data) {
    if (!HAS_WHITESPACE.test(data.address)) {
        return;
    }
    let address;
    let rest;
    const quoted = data.address.match(QUOTED_LOCAL_ADDR);
    if (quoted) {
        if (!quoted[2]) {
            // the whitespace sits inside the quoted local part, this is a well formed mailbox
            return;
        }
        // a real mailbox with wreckage trailing it, so peel the addr-spec off whole rather
        // than splitting into the quotes
        address = quoted[1];
        rest = [quoted[2]];
    }
    else {
        if (data.address.indexOf('"') >= 0) {
            // Splitting on whitespace loses track of where the quoted string starts and ends,
            // and this module does not take addresses out of quoted strings: the run picked out
            // of '<junk "user@evil.com b"@good.com>' would be an address from the domain the
            // quotes were hiding. Every well formed shape was already handled above, so what is
            // left is wreckage either way and the original is the honest answer
            return;
        }
        const parts = data.address.split(/\s+/);
        let addrIndex = parts.findIndex(part => ADDR_SPEC.test(part));
        if (addrIndex < 0) {
            addrIndex = parts.findIndex(part => LOOSE_ADDR_SPEC.test(part));
        }
        if (addrIndex < 0) {
            // nothing in there reads as an address, there is no better answer than the original
            return;
        }
        address = parts.splice(addrIndex, 1)[0];
        rest = parts;
    }
    data.address = address;
    data.text = [data.text]
        .concat(rest)
        .filter(part => part)
        .join(' ');
}
/**
 * Converts tokens for a single address into an address object
 *
 * @param tokens Tokens object
 * @param depth Current recursion depth for nested group protection
 * @return Address object
 */
function _handleAddress(tokens, depth) {
    let isGroup = false;
    let state = 'text';
    const addresses = [];
    const data = {
        address: [],
        comment: [],
        group: [],
        text: [],
        textWasQuoted: []
    };
    let insideQuotes = false;
    // Filter out <addresses>, (comments) and regular text
    for (let i = 0, len = tokens.length; i < len; i++) {
        const token = tokens[i];
        const prevToken = i ? tokens[i - 1] : null;
        if (token.type === 'operator') {
            switch (token.value) {
                case '<':
                    state = 'address';
                    insideQuotes = false;
                    break;
                case '(':
                    state = 'comment';
                    insideQuotes = false;
                    break;
                case ':':
                    state = 'group';
                    isGroup = true;
                    insideQuotes = false;
                    break;
                case '"':
                    insideQuotes = !insideQuotes;
                    state = 'text';
                    break;
                default:
                    state = 'text';
                    insideQuotes = false;
                    break;
            }
        }
        else if (token.value) {
            if (state === 'address') {
                // Handle unquoted name that includes a "<".
                // Apple Mail truncates everything between an unexpected < and an address.
                token.value = token.value.replace(/^[^<]*<\s*/, '');
            }
            // A comment is folding whitespace. It may sit inside an addr-spec, on either side
            // of the '@', but it cannot join two atoms into one: gluing across it would read
            // 'user@example.com(x)evil.com' as the single domain 'example.comevil.com' and
            // deliver to a domain the sender never named.
            const parts = data[state];
            const joins = prevToken &&
                prevToken.noBreak &&
                parts.length &&
                (prevToken.value !== ')' || parts[parts.length - 1].slice(-1) === '@' || token.value.charAt(0) === '@');
            if (joins) {
                data[state][data[state].length - 1] += token.value;
                if (state === 'text' && insideQuotes) {
                    data.textWasQuoted[data.textWasQuoted.length - 1] = true;
                }
            }
            else {
                data[state].push(token.value);
                if (state === 'text') {
                    data.textWasQuoted.push(insideQuotes);
                }
            }
        }
    }
    // If there is no text but a comment, replace the two
    if (!data.text.length && data.comment.length) {
        data.text = data.comment;
        data.comment = [];
    }
    if (isGroup) {
        // http://tools.ietf.org/html/rfc2822#appendix-A.1.3
        data.text = data.text.join(' ');
        // Parse group members, but flatten any nested groups (RFC 5322 doesn't allow nesting)
        let groupMembers = [];
        if (data.group.length) {
            const parsedGroup = addressparser(data.group.join(','), { _depth: depth + 1 });
            parsedGroup.forEach(member => {
                if (member.group) {
                    groupMembers = groupMembers.concat(member.group);
                }
                else {
                    groupMembers.push(member);
                }
            });
        }
        addresses.push({
            name: data.text || '',
            group: groupMembers
        });
    }
    else {
        // If no address was found, try to detect one from regular text
        if (!data.address.length && data.text.length) {
            for (let i = data.text.length - 1; i >= 0; i--) {
                // Security: Do not extract email addresses from quoted strings.
                // RFC 5321 allows @ inside quoted local-parts like "user@domain"@example.com.
                // Extracting emails from quoted text leads to misrouting vulnerabilities.
                if (!data.textWasQuoted[i] && ADDR_SPEC.test(data.text[i])) {
                    data.address = data.text.splice(i, 1);
                    data.textWasQuoted.splice(i, 1);
                    break;
                }
            }
            // Try a looser regex match if strict match found nothing
            if (!data.address.length) {
                let extracted = false;
                for (let i = data.text.length - 1; i >= 0; i--) {
                    // Security: Do not extract email addresses from quoted strings
                    if (!data.textWasQuoted[i]) {
                        data.text[i] = data.text[i]
                            .replace(/\s*\b[^@\s]+@[^\s]+\b\s*/, (match) => {
                            if (!extracted) {
                                data.address = [match.trim()];
                                extracted = true;
                                return ' ';
                            }
                            return match;
                        })
                            .trim();
                        if (extracted) {
                            break;
                        }
                    }
                }
            }
        }
        // If there's still no text but a comment exists, replace the two
        if (!data.text.length && data.comment.length) {
            data.text = data.comment;
            data.comment = [];
        }
        // Keep only the first address occurrence, push others to regular text
        if (data.address.length > 1) {
            data.text = data.text.concat(data.address.splice(1));
        }
        // An address is only taken from unquoted text, so anything left in the text at this
        // point that still has to serve as the address carries its quoting in this flag
        const addressFromQuotedText = !data.address.length && data.textWasQuoted.some(wasQuoted => wasQuoted);
        // Join values with spaces
        data.text = data.text.join(' ');
        data.address = data.address.join(' ');
        _recoverAddrSpec(data);
        const address = {
            address: data.address || data.text || '',
            name: data.text || data.address || ''
        };
        if (address.address === address.name) {
            if (/@/.test(address.address || '')) {
                address.name = '';
            }
            else {
                address.address = '';
            }
        }
        if (addressFromQuotedText && address.address) {
            address.address = _quoteLocalPart(address.address);
        }
        addresses.push(address);
    }
    return addresses;
}
/**
 * Creates a Tokenizer object for tokenizing address field strings
 *
 * @constructor
 * @param str Address field string
 */
class Tokenizer {
    constructor(str) {
        this.str = (str || '').toString();
        this.operatorCurrent = '';
        this.operatorExpecting = '';
        this.node = null;
        this.escaped = false;
        this.inDomainLiteral = false;
        this.list = [];
        /**
         * Operator tokens and which tokens are expected to end the sequence
         */
        this.operators = {
            '"': '"',
            '(': ')',
            '<': '>',
            ',': '',
            ':': ';',
            // Semicolons are not a legal delimiter per the RFC2822 grammar other
            // than for terminating a group, but they are also not valid for any
            // other use in this context.  Given that some mail clients have
            // historically allowed the semicolon as a delimiter equivalent to the
            // comma in their UI, it makes sense to treat them the same as a comma
            // when used outside of a group.
            ';': ''
        };
    }
    /**
     * Tokenizes the original input string
     *
     * @return An array of operator|text tokens
     */
    tokenize() {
        const list = [];
        for (let i = 0, len = this.str.length; i < len; i++) {
            const chr = this.str.charAt(i);
            const nextChr = i < len - 1 ? this.str.charAt(i + 1) : null;
            this.checkChar(chr, nextChr);
        }
        this.list.forEach(node => {
            node.value = (node.value || '').toString().trim();
            if (node.value) {
                list.push(node);
            }
        });
        return list;
    }
    /**
     * Checks if a character is an operator or text and acts accordingly
     *
     * @param chr Character from the address field
     */
    checkChar(chr, nextChr) {
        // Track RFC 5322 domain-literals ("[" *dtext "]"). Operator characters such
        // as the ":" of an IPv6 address-literal (user@[IPv6:2001:db8::1]) are dtext
        // and must not be treated as the group delimiter while inside the brackets.
        // Quoted strings and comments are handled separately via operatorExpecting,
        // so only enter this state when no operator is open. The list separators ","
        // and ";" are the exception: they always end the literal (and split the
        // address list) so that an unclosed "[" cannot swallow later recipients.
        if (!this.escaped && !this.operatorExpecting) {
            if (!this.inDomainLiteral && chr === '[') {
                this.inDomainLiteral = true;
            }
            else if (this.inDomainLiteral && (chr === ']' || chr === ',' || chr === ';')) {
                this.inDomainLiteral = false;
            }
        }
        if (this.escaped) {
            // ignore next condition blocks
        }
        else if (chr === this.operatorExpecting) {
            this.node = {
                type: 'operator',
                value: chr
            };
            if (nextChr && ![' ', '\t', '\r', '\n', ',', ';'].includes(nextChr)) {
                this.node.noBreak = true;
            }
            this.list.push(this.node);
            this.node = null;
            this.operatorExpecting = '';
            this.escaped = false;
            return;
        }
        else if (!this.operatorExpecting && !this.inDomainLiteral && chr in this.operators) {
            this.node = {
                type: 'operator',
                value: chr
            };
            this.list.push(this.node);
            this.node = null;
            this.operatorExpecting = this.operators[chr];
            this.escaped = false;
            return;
        }
        else if (['"', "'"].includes(this.operatorExpecting) && chr === '\\') {
            this.escaped = true;
            return;
        }
        if (!this.node) {
            this.node = {
                type: 'text',
                value: ''
            };
            this.list.push(this.node);
        }
        if (chr === '\n') {
            // Convert newlines to spaces. Carriage return is ignored as \r and \n usually
            // go together anyway and there already is a WS for \n. Lone \r means something is fishy.
            chr = ' ';
        }
        if (chr.charCodeAt(0) >= 0x21 || [' ', '\t'].includes(chr)) {
            // skip command bytes
            this.node.value += chr;
        }
        this.escaped = false;
    }
}
/**
 * Maximum recursion depth for parsing nested groups.
 * RFC 5322 doesn't allow nested groups, so this is a safeguard against
 * malicious input that could cause stack overflow.
 */
const MAX_NESTED_GROUP_DEPTH = 50;
/**
 * Parses structured e-mail addresses from an address field
 *
 * Example:
 *
 *    'Name <address@domain>'
 *
 * will be converted to
 *
 *     [{name: 'Name', address: 'address@domain'}]
 *
 * @param str Address field
 * @param options Optional options object
 * @param options._depth Internal recursion depth counter (do not set manually)
 * @return An array of address objects
 */
function addressparser(str, options) {
    options = options || {};
    const depth = options._depth || 0;
    // Prevent stack overflow from deeply nested groups (DoS protection)
    if (depth > MAX_NESTED_GROUP_DEPTH) {
        return [];
    }
    const tokenizer = new Tokenizer(str);
    const tokens = tokenizer.tokenize();
    const addresses = [];
    let address = [];
    let parsedAddresses = [];
    tokens.forEach(token => {
        if (token.type === 'operator' && (token.value === ',' || token.value === ';')) {
            if (address.length) {
                addresses.push(address);
            }
            address = [];
        }
        else {
            address.push(token);
        }
    });
    if (address.length) {
        addresses.push(address);
    }
    addresses.forEach(addr => {
        const handled = _handleAddress(addr, depth);
        // Appended in place. Rebuilding the accumulator with concat() would copy every
        // entry collected so far on each address, making a flat list cost O(n^2).
        for (let i = 0; i < handled.length; i++) {
            parsedAddresses.push(handled[i]);
        }
    });
    // Merge fragments produced when unquoted display names contain commas.
    // "Joe Foo, PhD <joe@example.com>" is split on the comma into
    // [{name:"Joe Foo", address:""}, {name:"PhD", address:"joe@example.com"}].
    // Recombine: a name-only entry followed by an entry with both name and address.
    // Walked back to front so that a run of fragments folds into one entry in a single
    // pass. Splicing each fragment out of the list instead would cost O(n^2).
    const mergedAddresses = [];
    for (let i = parsedAddresses.length - 1; i >= 0; i--) {
        const current = parsedAddresses[i];
        const next = mergedAddresses.length ? mergedAddresses[mergedAddresses.length - 1] : null;
        if (next && current.address === '' && current.name && !current.group && next.address && next.name) {
            next.name = current.name + ', ' + next.name;
        }
        else {
            mergedAddresses.push(current);
        }
    }
    mergedAddresses.reverse();
    parsedAddresses = mergedAddresses;
    if (options.flatten) {
        const flatAddresses = [];
        const walkAddressList = (list) => {
            list.forEach(entry => {
                if (entry.group) {
                    return walkAddressList(entry.group);
                }
                flatAddresses.push(entry);
            });
        };
        walkAddressList(parsedAddresses);
        return flatAddresses;
    }
    return parsedAddresses;
}
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 4059:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Encoder = void 0;
exports.encode = encode;
exports.wrap = wrap;
const node_stream_1 = __nccwpck_require__(7075);
/**
 * Encodes a Buffer into a base64 encoded string
 *
 * @param buffer Buffer to convert
 * @returns base64 encoded string
 */
function encode(buffer) {
    if (typeof buffer === 'string') {
        buffer = Buffer.from(buffer, 'utf-8');
    }
    return buffer.toString('base64');
}
/**
 * Adds soft line breaks to a base64 string
 *
 * @param str base64 encoded string that might need line wrapping
 * @param [lineLength=76] Maximum allowed length for a line
 * @returns Soft-wrapped base64 encoded string
 */
function wrap(str, lineLength) {
    str = (str || '').toString();
    lineLength = lineLength || 76;
    if (str.length <= lineLength) {
        return str;
    }
    const result = [];
    let pos = 0;
    const chunkLength = lineLength * 1024;
    const wrapRegex = new RegExp('.{' + lineLength + '}', 'g');
    while (pos < str.length) {
        const wrappedLines = str.substr(pos, chunkLength).replace(wrapRegex, '$&\r\n').trim();
        result.push(wrappedLines);
        pos += chunkLength;
    }
    return result.join('\r\n').trim();
}
/**
 * Creates a transform stream for encoding data to base64 encoding
 *
 * @constructor
 * @param options Stream options
 * @param [options.lineLength=76] Maximum length for lines, set to false to disable wrapping
 */
class Encoder extends node_stream_1.Transform {
    constructor(options) {
        super();
        this.options = options || {};
        if (this.options.lineLength !== false) {
            this.options.lineLength = this.options.lineLength || 76;
        }
        this._curLine = '';
        this._remainingBytes = false;
        this.inputBytes = 0;
        this.outputBytes = 0;
    }
    _transform(chunk, encoding, done) {
        let buf = encoding !== 'buffer' ? Buffer.from(chunk, encoding) : chunk;
        if (!buf || !buf.length) {
            setImmediate(done);
            return;
        }
        this.inputBytes += buf.length;
        if (this._remainingBytes && this._remainingBytes.length) {
            buf = Buffer.concat([this._remainingBytes, buf], this._remainingBytes.length + buf.length);
            this._remainingBytes = false;
        }
        if (buf.length % 3) {
            this._remainingBytes = buf.slice(buf.length - (buf.length % 3));
            buf = buf.slice(0, buf.length - (buf.length % 3));
        }
        else {
            this._remainingBytes = false;
        }
        let b64 = this._curLine + encode(buf);
        if (this.options.lineLength) {
            b64 = wrap(b64, this.options.lineLength);
            // remove last line as it is still most probably incomplete
            const lastLF = b64.lastIndexOf('\n');
            if (lastLF < 0) {
                this._curLine = b64;
                b64 = '';
            }
            else if (lastLF === b64.length - 1) {
                this._curLine = '';
            }
            else {
                this._curLine = b64.substring(lastLF + 1);
                b64 = b64.substring(0, lastLF + 1);
            }
        }
        if (b64) {
            this.outputBytes += b64.length;
            this.push(Buffer.from(b64, 'ascii'));
        }
        setImmediate(done);
    }
    _flush(done) {
        if (this._remainingBytes && this._remainingBytes.length) {
            this._curLine += encode(this._remainingBytes);
        }
        if (this._curLine) {
            this._curLine = wrap(this._curLine, this.options.lineLength);
            this.outputBytes += this._curLine.length;
            this.push(Buffer.from(this._curLine, 'ascii'));
            this._curLine = '';
        }
        done();
    }
}
exports.Encoder = Encoder;


/***/ }),

/***/ 1967:
/***/ (function(module, exports, __nccwpck_require__) {


// FIXME:
// replace this Transform mess with a method that pipes input argument to output argument
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const message_parser_js_1 = __importDefault(__nccwpck_require__(2526));
const relaxed_body_js_1 = __importDefault(__nccwpck_require__(1601));
const sign_js_1 = __importDefault(__nccwpck_require__(4502));
const node_stream_1 = __nccwpck_require__(7075);
const node_fs_1 = __importDefault(__nccwpck_require__(3024));
const node_path_1 = __importDefault(__nccwpck_require__(6760));
const node_crypto_1 = __importDefault(__nccwpck_require__(7598));
const objects_js_1 = __nccwpck_require__(6477);
const DKIM_ALGO = 'sha256';
const MAX_MESSAGE_SIZE = 10 * 1024 * 1024; // buffer messages larger than this to disk
class DKIMSigner {
    constructor(options, keys, input, output) {
        this.options = options || {};
        this.keys = keys;
        this.cacheTreshold = Number(this.options.cacheTreshold) || MAX_MESSAGE_SIZE;
        this.hashAlgo = this.options.hashAlgo || DKIM_ALGO;
        this.cacheDir = this.options.cacheDir || false;
        this.chunks = [];
        this.chunklen = 0;
        this.readPos = 0;
        this.cachePath = this.cacheDir
            ? node_path_1.default.join(this.cacheDir, 'message.' + Date.now() + '-' + node_crypto_1.default.randomBytes(14).toString('hex'))
            : false;
        this.cache = false;
        this.headers = false;
        this.bodyHash = false;
        this.parser = false;
        this.relaxedBody = false;
        this.input = input;
        this.output = output;
        this.output.usingCache = false;
        this.hasErrored = false;
        this.input.on('error', err => {
            this.hasErrored = true;
            this.cleanup();
            output.emit('error', err);
        });
    }
    cleanup() {
        if (!this.cache || !this.cachePath) {
            return;
        }
        node_fs_1.default.unlink(this.cachePath, () => false);
    }
    createReadCache() {
        // pipe remainings to cache file
        this.cache = node_fs_1.default.createReadStream(this.cachePath);
        this.cache.once('error', err => {
            this.cleanup();
            this.output.emit('error', err);
        });
        this.cache.once('close', () => {
            this.cleanup();
        });
        this.cache.pipe(this.output);
    }
    sendNextChunk() {
        if (this.hasErrored) {
            return;
        }
        if (this.readPos >= this.chunks.length) {
            if (!this.cache) {
                this.output.end();
                return;
            }
            return this.createReadCache();
        }
        const chunk = this.chunks[this.readPos++];
        if (this.output.write(chunk) === false) {
            this.output.once('drain', () => {
                this.sendNextChunk();
            });
            return;
        }
        setImmediate(() => this.sendNextChunk());
    }
    sendSignedOutput() {
        let keyPos = 0;
        const signNextKey = () => {
            if (keyPos >= this.keys.length) {
                this.output.write(this.parser.rawHeaders);
                setImmediate(() => this.sendNextChunk());
                return;
            }
            const key = this.keys[keyPos++];
            const dkimField = (0, sign_js_1.default)(this.headers, this.hashAlgo, this.bodyHash, {
                domainName: key.domainName,
                keySelector: key.keySelector,
                privateKey: key.privateKey,
                headerFieldNames: this.options.headerFieldNames,
                skipFields: this.options.skipFields
            });
            if (dkimField) {
                this.output.write(Buffer.from(dkimField + '\r\n'));
            }
            setImmediate(signNextKey);
        };
        if (this.bodyHash && this.headers) {
            return signNextKey();
        }
        this.output.write(this.parser.rawHeaders);
        this.sendNextChunk();
    }
    createWriteCache() {
        this.output.usingCache = true;
        // pipe remainings to cache file
        this.cache = node_fs_1.default.createWriteStream(this.cachePath);
        this.cache.once('error', err => {
            this.cleanup();
            // drain input
            this.relaxedBody.unpipe(this.cache);
            this.relaxedBody.on('readable', () => {
                while (this.relaxedBody.read() !== null) {
                    // do nothing
                }
            });
            this.hasErrored = true;
            // emit error
            this.output.emit('error', err);
        });
        this.cache.once('close', () => {
            this.sendSignedOutput();
        });
        this.relaxedBody.removeAllListeners('readable');
        this.relaxedBody.pipe(this.cache);
    }
    signStream() {
        this.parser = new message_parser_js_1.default();
        this.relaxedBody = new relaxed_body_js_1.default({
            hashAlgo: this.hashAlgo
        });
        this.parser.on('headers', value => {
            this.headers = value;
        });
        this.relaxedBody.on('hash', value => {
            this.bodyHash = value;
        });
        this.relaxedBody.on('readable', () => {
            let chunk;
            if (this.cache) {
                return;
            }
            while ((chunk = this.relaxedBody.read()) !== null) {
                this.chunks.push(chunk);
                this.chunklen += chunk.length;
                if (this.chunklen >= this.cacheTreshold && this.cachePath) {
                    return this.createWriteCache();
                }
            }
        });
        this.relaxedBody.on('end', () => {
            if (this.cache) {
                return;
            }
            this.sendSignedOutput();
        });
        this.parser.pipe(this.relaxedBody);
        setImmediate(() => this.input.pipe(this.parser));
    }
}
class DKIM {
    constructor(options) {
        this.options = options || {};
        this.keys = [].concat(this.options.keys || {
            domainName: options.domainName,
            keySelector: options.keySelector,
            privateKey: options.privateKey
        });
    }
    sign(input, extraOptions) {
        const output = new node_stream_1.PassThrough();
        let inputStream = input;
        let writeValue = false;
        if (Buffer.isBuffer(input)) {
            writeValue = input;
            inputStream = new node_stream_1.PassThrough();
        }
        else if (typeof input === 'string') {
            writeValue = Buffer.from(input);
            inputStream = new node_stream_1.PassThrough();
        }
        let options = this.options;
        if (extraOptions && Object.keys(extraOptions).length) {
            // extraOptions is mail.data._dkim, caller supplied message data. An own
            // "__proto__" key there would let every option this signer reads and the
            // transport did not set, such as skipFields, answer from the caller
            options = (0, objects_js_1.copyOwnKeys)({}, extraOptions);
            (0, objects_js_1.copyOwnKeys)(options, this.options);
        }
        const signer = new DKIMSigner(options, this.keys, inputStream, output);
        setImmediate(() => {
            signer.signStream();
            if (writeValue) {
                setImmediate(() => {
                    inputStream.end(writeValue);
                });
            }
        });
        return output;
    }
}
exports["default"] = DKIM;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 2526:
/***/ ((module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const node_stream_1 = __nccwpck_require__(7075);
/**
 * MessageParser instance is a transform stream that separates message headers
 * from the rest of the body. Headers are emitted with the 'headers' event. Message
 * body is passed on as the resulting stream.
 */
class MessageParser extends node_stream_1.Transform {
    constructor(options) {
        super(options);
        this.lastBytes = Buffer.alloc(4);
        this.headersParsed = false;
        this.headerBytes = 0;
        this.headerChunks = [];
        this.rawHeaders = false;
        this.bodySize = 0;
    }
    /**
     * Keeps count of the last 4 bytes in order to detect line breaks on chunk boundaries
     *
     * @param data Next data chunk from the stream
     */
    updateLastBytes(data) {
        const lblen = this.lastBytes.length;
        const nblen = Math.min(data.length, lblen);
        // shift existing bytes
        for (let i = 0, len = lblen - nblen; i < len; i++) {
            this.lastBytes[i] = this.lastBytes[i + nblen];
        }
        // add new bytes
        for (let i = 1; i <= nblen; i++) {
            this.lastBytes[lblen - i] = data[data.length - i];
        }
    }
    /**
     * Finds and removes message headers from the remaining body. We want to keep
     * headers separated until final delivery to be able to modify these
     *
     * @param data Next chunk of data
     * @return Returns true if headers are already found or false otherwise
     */
    checkHeaders(data) {
        if (this.headersParsed) {
            return true;
        }
        const lblen = this.lastBytes.length;
        let headerPos = 0;
        for (let i = 0, len = this.lastBytes.length + data.length; i < len; i++) {
            let chr;
            if (i < lblen) {
                chr = this.lastBytes[i];
            }
            else {
                chr = data[i - lblen];
            }
            if (chr === 0x0a && i) {
                const pr1 = i - 1 < lblen ? this.lastBytes[i - 1] : data[i - 1 - lblen];
                const pr2 = i > 1 ? (i - 2 < lblen ? this.lastBytes[i - 2] : data[i - 2 - lblen]) : false;
                if (pr1 === 0x0a) {
                    this.headersParsed = true;
                    headerPos = i - lblen + 1;
                    this.headerBytes += headerPos;
                    break;
                }
                else if (pr1 === 0x0d && pr2 === 0x0a) {
                    this.headersParsed = true;
                    headerPos = i - lblen + 1;
                    this.headerBytes += headerPos;
                    break;
                }
            }
        }
        if (this.headersParsed) {
            this.headerChunks.push(data.slice(0, headerPos));
            this.rawHeaders = Buffer.concat(this.headerChunks, this.headerBytes);
            this.headerChunks = null;
            this.emit('headers', this.parseHeaders());
            if (data.length > headerPos) {
                const chunk = data.slice(headerPos);
                this.bodySize += chunk.length;
                // this would be the first chunk of data sent downstream
                setImmediate(() => this.push(chunk));
            }
            return false;
        }
        this.headerBytes += data.length;
        this.headerChunks.push(data);
        // store last 4 bytes to catch header break
        this.updateLastBytes(data);
        return false;
    }
    _transform(chunk, encoding, callback) {
        if (!chunk || !chunk.length) {
            return callback();
        }
        if (typeof chunk === 'string') {
            chunk = Buffer.from(chunk, encoding);
        }
        let headersFound;
        try {
            headersFound = this.checkHeaders(chunk);
        }
        catch (E) {
            return callback(E);
        }
        if (headersFound) {
            this.bodySize += chunk.length;
            this.push(chunk);
        }
        setImmediate(callback);
    }
    _flush(callback) {
        if (this.headerChunks) {
            // no empty line was seen, so the message consists of headers only
            this.rawHeaders = Buffer.concat(this.headerChunks, this.headerBytes);
            this.headerChunks = null;
            this.emit('headers', this.parseHeaders());
        }
        callback();
    }
    parseHeaders() {
        // the header bytes are kept as they are, one character per byte, so the
        // signature covers exactly the bytes the receiving side canonicalizes
        // Only SP and HTAB fold a line, and only they are trimmed from the field name, the
        // same whitespace the relaxed canonicalization in sign.ts works with
        const lines = (this.rawHeaders || Buffer.alloc(0)).toString('binary').split(/\r?\n/);
        for (let i = lines.length - 1; i > 0; i--) {
            if (/^[ \t]/.test(lines[i])) {
                lines[i - 1] += '\n' + lines[i];
                lines.splice(i, 1);
            }
        }
        return lines
            .filter(line => /[^ \t\r]/.test(line))
            .map(line => ({
            key: line
                .substr(0, line.indexOf(':'))
                .replace(/^[ \t]+|[ \t]+$/g, '')
                .toLowerCase(),
            line
        }));
    }
}
exports["default"] = MessageParser;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 1601:
/***/ (function(module, exports, __nccwpck_require__) {


// streams through a message body and calculates relaxed body hash
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const node_stream_1 = __nccwpck_require__(7075);
const node_crypto_1 = __importDefault(__nccwpck_require__(7598));
const CHAR_CR = 0x0d;
const CHAR_LF = 0x0a;
const CHAR_SPACE = 0x20;
const CHAR_TAB = 0x09;
const CRLF = Buffer.from('\r\n');
// a run of empty lines is hashed from this buffer in slices
const EMPTY_LINES = Buffer.alloc(4096, CRLF);
/**
 * Passes the message body through unchanged and hashes its relaxed
 * canonicalization (RFC 6376 section 3.4.4) on the side: whitespace at the end
 * of a line is dropped, runs of whitespace within a line become a single space,
 * every line ends with CRLF, empty lines at the end of the body are ignored and
 * a non-empty body always ends with CRLF. Bytes are canonicalized as they arrive,
 * so a line of any length costs constant memory.
 */
class RelaxedBody extends node_stream_1.Transform {
    constructor(options) {
        super();
        options = options || {};
        this.bodyHash = node_crypto_1.default.createHash(options.hashAlgo || 'sha256');
        this.byteLength = 0;
        this.debug = options.debug;
        this._debugBody = options.debug ? [] : false;
        this._lineHasContent = false;
        this._pendingWsp = false;
        this._pendingCr = false;
        this._pendingEmptyLines = 0;
    }
    _hashCanonical(data) {
        if (!data.length) {
            return;
        }
        this.bodyHash.update(data);
        if (this._debugBody) {
            this._debugBody.push(Buffer.from(data));
        }
    }
    _hashEmptyLines() {
        while (this._pendingEmptyLines > 0) {
            const count = Math.min(this._pendingEmptyLines, EMPTY_LINES.length / 2);
            this._hashCanonical(EMPTY_LINES.subarray(0, count * 2));
            this._pendingEmptyLines -= count;
        }
    }
    /**
     * Writes a content byte, with the space a pending run of whitespace collapses to,
     * into the output buffer and returns the new write position. Kept a method rather
     * than a closure so the write position stays a plain local in the byte loop
     */
    _emitContent(out, outPos, c) {
        if (!this._lineHasContent) {
            if (this._pendingEmptyLines) {
                // the first content byte of a line is where the empty lines before it
                // become part of the body, so hash what is in the buffer before them
                this._hashCanonical(out.subarray(0, outPos));
                outPos = 0;
                this._hashEmptyLines();
            }
            this._lineHasContent = true;
        }
        if (this._pendingWsp) {
            out[outPos++] = CHAR_SPACE;
            this._pendingWsp = false;
        }
        out[outPos++] = c;
        return outPos;
    }
    updateHash(chunk, final) {
        // every byte contributes itself at most once, plus a CR for a bare LF
        // and, once per chunk, a pending space and CR carried over from before
        const out = Buffer.allocUnsafe(chunk.length * 2 + 2);
        let outPos = 0;
        for (let i = 0; i < chunk.length; i++) {
            const c = chunk[i];
            if (c === CHAR_LF) {
                // end of line, a CR right before it and any trailing whitespace are dropped
                if (this._lineHasContent) {
                    out[outPos++] = CHAR_CR;
                    out[outPos++] = CHAR_LF;
                    this._lineHasContent = false;
                }
                else {
                    this._pendingEmptyLines++;
                }
                this._pendingWsp = false;
                this._pendingCr = false;
                continue;
            }
            if (this._pendingCr) {
                // not followed by LF, so the CR is content
                outPos = this._emitContent(out, outPos, CHAR_CR);
                this._pendingCr = false;
            }
            if (c === CHAR_CR) {
                this._pendingCr = true;
            }
            else if (c === CHAR_SPACE || c === CHAR_TAB) {
                this._pendingWsp = true;
            }
            else {
                outPos = this._emitContent(out, outPos, c);
            }
        }
        if (final && this._pendingCr) {
            // a CR at the very end of the body is content
            outPos = this._emitContent(out, outPos, CHAR_CR);
            this._pendingCr = false;
        }
        this._hashCanonical(out.subarray(0, outPos));
    }
    _transform(chunk, encoding, callback) {
        if (!chunk || !chunk.length) {
            return callback();
        }
        if (typeof chunk === 'string') {
            chunk = Buffer.from(chunk, encoding);
        }
        this.updateHash(chunk);
        this.byteLength += chunk.length;
        this.push(chunk);
        callback();
    }
    _flush(callback) {
        this.updateHash(Buffer.alloc(0), true);
        if (this._lineHasContent) {
            // the body does not end with a line break, add one
            this._hashCanonical(CRLF);
        }
        this.emit('hash', this.bodyHash.digest('base64'), this.debug ? Buffer.concat(this._debugBody) : false);
        callback();
    }
}
exports["default"] = RelaxedBody;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 4502:
/***/ (function(module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const punycode = __importStar(__nccwpck_require__(111));
const mimeFuncs = __importStar(__nccwpck_require__(1038));
const node_crypto_1 = __importDefault(__nccwpck_require__(7598));
/**
 * Returns DKIM signature header line
 *
 * @param headers Parsed headers object from MessageParser
 * @param bodyHash Base64 encoded hash of the message
 * @param options DKIM options
 * @param options.domainName Domain name to be signed for
 * @param options.keySelector DKIM key selector to use
 * @param options.privateKey DKIM private key to use
 * @return Complete header line
 */
function sign(headers, hashAlgo, bodyHash, options) {
    options = options || {};
    // all listed fields from RFC4871 #5.5
    const defaultFieldNames = 'From:Sender:Reply-To:Subject:Date:Message-ID:To:' +
        'Cc:MIME-Version:Content-Type:Content-Transfer-Encoding:Content-ID:' +
        'Content-Description:Resent-Date:Resent-From:Resent-Sender:' +
        'Resent-To:Resent-Cc:Resent-Message-ID:In-Reply-To:References:' +
        'List-Id:List-Help:List-Unsubscribe:List-Subscribe:List-Post:' +
        'List-Owner:List-Archive';
    const fieldNames = options.headerFieldNames || defaultFieldNames;
    const canonicalizedHeaderData = relaxedHeaders(headers, fieldNames, options.skipFields);
    const dkimHeader = generateDKIMHeader(options.domainName, options.keySelector, canonicalizedHeaderData.fieldNames, hashAlgo, bodyHash);
    canonicalizedHeaderData.headers += 'dkim-signature:' + relaxedHeaderLine(dkimHeader);
    const signer = node_crypto_1.default.createSign(('rsa-' + hashAlgo).toUpperCase());
    // the header lines are 'binary' strings, so this reproduces the original header bytes
    signer.update(canonicalizedHeaderData.headers, 'latin1');
    let signature;
    try {
        signature = signer.sign(options.privateKey, 'base64');
    }
    catch (_E) {
        return false;
    }
    return dkimHeader + signature.replace(/(^.{73}|.{75}(?!\r?\n|\r))/g, '$&\r\n ').trim();
}
sign.relaxedHeaders = relaxedHeaders;
exports["default"] = sign;
function generateDKIMHeader(domainName, keySelector, fieldNames, hashAlgo, bodyHash) {
    // the caller supplied tag values are interpolated straight into the tag list, and none of
    // them has any way to carry a control char, DEL, or one of the delimiters that would close
    // the value and open a tag of its own
    const cleanTagValue = (value) => (value || '').toString().replace(/[\x00-\x1f\x7f;=]/g, '');
    const dkim = [
        'v=1',
        'a=rsa-' + hashAlgo,
        'c=relaxed/relaxed',
        'd=' + punycode.toASCII(cleanTagValue(domainName)),
        'q=dns/txt',
        's=' + cleanTagValue(keySelector),
        'bh=' + bodyHash,
        'h=' + cleanTagValue(fieldNames)
    ].join('; ');
    return mimeFuncs.foldLines('DKIM-Signature: ' + dkim, 76) + ';\r\n b=';
}
function relaxedHeaders(headers, fieldNames, skipFields) {
    const includedFields = new Set();
    const skip = new Set();
    const headerFields = new Map();
    (skipFields || '')
        .toLowerCase()
        .split(':')
        .forEach(field => {
        skip.add(field.trim());
    });
    (fieldNames || '')
        .toLowerCase()
        .split(':')
        .filter(field => !skip.has(field.trim()))
        .forEach(field => {
        includedFields.add(field.trim());
    });
    for (let i = headers.length - 1; i >= 0; i--) {
        const line = headers[i];
        // only include the first value from bottom to top
        if (includedFields.has(line.key) && !headerFields.has(line.key)) {
            headerFields.set(line.key, relaxedHeaderLine(line.line));
        }
    }
    const headersList = [];
    const fields = [];
    includedFields.forEach(field => {
        if (headerFields.has(field)) {
            fields.push(field);
            headersList.push(field + ':' + headerFields.get(field));
        }
    });
    return {
        headers: headersList.join('\r\n') + '\r\n',
        fieldNames: fields.join(':')
    };
}
/**
 * Relaxed canonicalization of a header field value (RFC 6376 section 3.4.2): unfold, turn
 * every run of SP and HTAB into a single SP and drop the whitespace next to the colon and
 * at the end. Only SP and HTAB count as whitespace, so bytes that decode to other space
 * characters, such as a non-breaking space in a UTF-8 header, stay as they are
 */
function relaxedHeaderLine(line) {
    return line
        .substr(line.indexOf(':') + 1)
        .replace(/\r?\n/g, '')
        .replace(/[ \t]+/g, ' ')
        .replace(/^ | $/g, '');
}
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 932:
/***/ ((__unused_webpack_module, exports) => {


/**
 * Nodemailer Error Codes
 *
 * Centralized error code definitions for consistent error handling.
 *
 * Usage:
 *   import * as errors from './errors.js';
 *   const err: NodemailerError = new Error('Connection closed');
 *   err.code = errors.ECONNECTION;
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EFETCH = exports.EURLACCESS = exports.EFILEACCESS = exports.EPROXY = exports.ECONFIG = exports.ESES = exports.ESENDMAIL = exports.EMAXRECIPIENTS = exports.EMAXLIMIT = exports.EOAUTH2 = exports.ENOAUTH = exports.EAUTH = exports.ESTREAM = exports.EMESSAGE = exports.EENVELOPE = exports.EPROTOCOL = exports.EREQUIRETLS = exports.ETLS = exports.EDNS = exports.ESOCKET = exports.ETIMEDOUT = exports.ECONNECTION = exports.ERROR_CODES = void 0;
/**
 * Error code descriptions for documentation and debugging
 */
exports.ERROR_CODES = {
    // Connection errors
    ECONNECTION: 'Connection closed unexpectedly',
    ETIMEDOUT: 'Connection or operation timed out',
    ESOCKET: 'Socket-level error',
    EDNS: 'DNS resolution failed',
    // TLS/Security errors
    ETLS: 'TLS handshake or STARTTLS failed',
    EREQUIRETLS: 'REQUIRETLS not supported by server (RFC 8689)',
    // Protocol errors
    EPROTOCOL: 'Invalid SMTP server response',
    EENVELOPE: 'Invalid mail envelope (sender or recipients)',
    EMESSAGE: 'Message delivery error',
    ESTREAM: 'Stream processing error',
    // Authentication errors
    EAUTH: 'Authentication failed',
    ENOAUTH: 'Authentication credentials not provided',
    EOAUTH2: 'OAuth2 token generation or refresh error',
    // Resource errors
    EMAXLIMIT: 'Pool resource limit reached (max messages per connection)',
    EMAXRECIPIENTS: 'Recipient count exceeds maxRecipients',
    // Transport-specific errors
    ESENDMAIL: 'Sendmail command error',
    ESES: 'AWS SES transport error',
    // Configuration and access errors
    ECONFIG: 'Invalid configuration',
    EPROXY: 'Proxy connection error',
    EFILEACCESS: 'File access rejected (disableFileAccess is set)',
    EURLACCESS: 'URL access rejected (disableUrlAccess is set)',
    EFETCH: 'HTTP fetch error'
};
// Error codes as string constants
exports.ECONNECTION = 'ECONNECTION';
exports.ETIMEDOUT = 'ETIMEDOUT';
exports.ESOCKET = 'ESOCKET';
exports.EDNS = 'EDNS';
exports.ETLS = 'ETLS';
exports.EREQUIRETLS = 'EREQUIRETLS';
exports.EPROTOCOL = 'EPROTOCOL';
exports.EENVELOPE = 'EENVELOPE';
exports.EMESSAGE = 'EMESSAGE';
exports.ESTREAM = 'ESTREAM';
exports.EAUTH = 'EAUTH';
exports.ENOAUTH = 'ENOAUTH';
exports.EOAUTH2 = 'EOAUTH2';
exports.EMAXLIMIT = 'EMAXLIMIT';
exports.EMAXRECIPIENTS = 'EMAXRECIPIENTS';
exports.ESENDMAIL = 'ESENDMAIL';
exports.ESES = 'ESES';
exports.ECONFIG = 'ECONFIG';
exports.EPROXY = 'EPROXY';
exports.EFILEACCESS = 'EFILEACCESS';
exports.EURLACCESS = 'EURLACCESS';
exports.EFETCH = 'EFETCH';


/***/ }),

/***/ 307:
/***/ (function(module, exports, __nccwpck_require__) {


// module to handle cookies
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
const urllib = __importStar(__nccwpck_require__(2452));
const SESSION_TIMEOUT = 1800; // 30 min
/**
 * Creates a biskviit cookie jar for managing cookie values in memory
 *
 * @constructor
 * @param [options] Optional options object
 */
class Cookies {
    constructor(options) {
        this.options = options || {};
        this.cookies = [];
    }
    /**
     * Stores a cookie string to the cookie storage
     *
     * @param cookieStr Value from the 'Set-Cookie:' header
     * @param url Current URL
     */
    set(cookieStr, url) {
        const urlparts = urllib.parse(url || '');
        const cookie = this.parse(cookieStr);
        let domain;
        if (cookie.domain) {
            domain = cookie.domain.replace(/^\./, '');
            // do not allow cross origin cookies
            if (
            // can't be valid if the requested domain is shorter than current hostname
            urlparts.hostname.length < domain.length ||
                // prefix domains with dot to be sure that partial matches are not used
                ('.' + urlparts.hostname).substr(-domain.length + 1) !== '.' + domain) {
                cookie.domain = urlparts.hostname;
            }
        }
        else {
            cookie.domain = urlparts.hostname;
        }
        if (!cookie.path) {
            cookie.path = this.getPath(urlparts.pathname);
        }
        // if no expire date, then use sessionTimeout value
        if (!cookie.expires) {
            cookie.expires = new Date(Date.now() + (Number(this.options.sessionTimeout || SESSION_TIMEOUT) || SESSION_TIMEOUT) * 1000);
        }
        return this.add(cookie);
    }
    /**
     * Returns cookie string for the 'Cookie:' header.
     *
     * @param url URL to check for
     * @returns Cookie header or empty string if no matches were found
     */
    get(url) {
        return this.list(url)
            .map(cookie => cookie.name + '=' + cookie.value)
            .join('; ');
    }
    /**
     * Lists all valied cookie objects for the specified URL
     *
     * @param url URL to check for
     * @returns An array of cookie objects
     */
    list(url) {
        const result = [];
        for (let i = this.cookies.length - 1; i >= 0; i--) {
            const cookie = this.cookies[i];
            if (this.isExpired(cookie)) {
                this.cookies.splice(i, 1);
                continue;
            }
            if (this.match(cookie, url)) {
                result.unshift(cookie);
            }
        }
        return result;
    }
    /**
     * Parses cookie string from the 'Set-Cookie:' header
     *
     * @param cookieStr String from the 'Set-Cookie:' header
     * @returns Cookie object
     */
    parse(cookieStr) {
        const cookie = {};
        (cookieStr || '')
            .toString()
            .split(';')
            .forEach(cookiePart => {
            const valueParts = cookiePart.split('=');
            const key = valueParts.shift().trim().toLowerCase();
            let value = valueParts.join('=').trim();
            let domain;
            if (!key) {
                // skip empty parts
                return;
            }
            switch (key) {
                case 'expires': {
                    const expires = new Date(value);
                    // ignore date if can not parse it
                    if (expires.toString() !== 'Invalid Date') {
                        cookie.expires = expires;
                    }
                    break;
                }
                case 'path':
                    cookie.path = value;
                    break;
                case 'domain':
                    domain = value.toLowerCase();
                    if (domain.length && domain.charAt(0) !== '.') {
                        domain = '.' + domain; // ensure preceeding dot for user set domains
                    }
                    cookie.domain = domain;
                    break;
                case 'max-age':
                    cookie.expires = new Date(Date.now() + (Number(value) || 0) * 1000);
                    break;
                case 'secure':
                    cookie.secure = true;
                    break;
                case 'httponly':
                    cookie.httponly = true;
                    break;
                default:
                    if (!cookie.name) {
                        cookie.name = key;
                        cookie.value = value;
                    }
            }
        });
        return cookie;
    }
    /**
     * Checks if a cookie object is valid for a specified URL
     *
     * @param cookie Cookie object
     * @param url URL to check for
     * @returns true if cookie is valid for specifiec URL
     */
    match(cookie, url) {
        const urlparts = urllib.parse(url || '');
        // check if hostname matches
        // .foo.com also matches subdomains, foo.com does not
        if (urlparts.hostname !== cookie.domain &&
            (cookie.domain.charAt(0) !== '.' ||
                ('.' + urlparts.hostname).substr(-cookie.domain.length) !== cookie.domain)) {
            return false;
        }
        // check if path matches
        const path = this.getPath(urlparts.pathname);
        if (path.substr(0, cookie.path.length) !== cookie.path) {
            return false;
        }
        // check secure argument
        if (cookie.secure && urlparts.protocol !== 'https:') {
            return false;
        }
        return true;
    }
    /**
     * Adds (or updates/removes if needed) a cookie object to the cookie storage
     *
     * @param cookie Cookie value to be stored
     */
    add(cookie) {
        // nothing to do here
        if (!cookie || !cookie.name) {
            return false;
        }
        // overwrite if has same params
        for (let i = 0, len = this.cookies.length; i < len; i++) {
            if (this.compare(this.cookies[i], cookie)) {
                // check if the cookie needs to be removed instead
                if (this.isExpired(cookie)) {
                    this.cookies.splice(i, 1); // remove expired/unset cookie
                    return false;
                }
                this.cookies[i] = cookie;
                return true;
            }
        }
        // add as new if not already expired
        if (!this.isExpired(cookie)) {
            this.cookies.push(cookie);
        }
        return true;
    }
    /**
     * Checks if two cookie objects are the same
     *
     * @param a Cookie to check against
     * @param b Cookie to check against
     * @returns True, if the cookies are the same
     */
    compare(a, b) {
        return a.name === b.name && a.path === b.path && a.domain === b.domain && a.secure === b.secure && a.httponly === b.httponly;
    }
    /**
     * Checks if a cookie is expired
     *
     * @param cookie Cookie object to check against
     * @returns True, if the cookie is expired
     */
    isExpired(cookie) {
        return (cookie.expires && cookie.expires < new Date()) || !cookie.value;
    }
    /**
     * Returns normalized cookie path for an URL path argument
     *
     * @param pathname
     * @returns Normalized path
     */
    getPath(pathname) {
        const pathParts = (pathname || '/').split('/');
        pathParts.pop(); // remove filename part
        let path = pathParts.join('/').trim();
        // ensure path prefix /
        if (path.charAt(0) !== '/') {
            path = '/' + path;
        }
        // ensure path suffix /
        if (path.substr(-1) !== '/') {
            path += '/';
        }
        return path;
    }
}
exports["default"] = Cookies;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 7336:
/***/ (function(module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const node_http_1 = __importDefault(__nccwpck_require__(7067));
const node_https_1 = __importDefault(__nccwpck_require__(4708));
const urllib = __importStar(__nccwpck_require__(2452));
const node_zlib_1 = __importDefault(__nccwpck_require__(8522));
const node_stream_1 = __nccwpck_require__(7075);
const cookies_js_1 = __importDefault(__nccwpck_require__(307));
const packageData = __importStar(__nccwpck_require__(5552));
const node_net_1 = __importDefault(__nccwpck_require__(7030));
const errors = __importStar(__nccwpck_require__(932));
const objects_js_1 = __nccwpck_require__(6477);
const MAX_REDIRECTS = 5;
// Only genuine TLS settings are taken from options.tls. That object reaches us straight
// from a user supplied attachment (content.tls), so keys like host, port, path, socketPath
// or lookup would otherwise repoint the request at a destination that never went through
// the URL checks below.
//
// The source of truth is the tls.connect() option list in the Node docs. A key missing
// here is dropped silently, so extend this list rather than working around it.
const TLS_OPTION_KEYS = [
    'ALPNProtocols',
    'ca',
    'cert',
    'checkServerIdentity',
    'ciphers',
    'crl',
    'dhparam',
    'ecdhCurve',
    'honorCipherOrder',
    'key',
    'maxVersion',
    'minVersion',
    'passphrase',
    'pfx',
    'rejectUnauthorized',
    'secureContext',
    'secureOptions',
    'secureProtocol',
    'servername',
    'sessionIdContext',
    'sigalgs'
];
/**
 * Resolves a URL only if it is one this module is willing to request.
 *
 * urllib.parse throws for a host that contains forbidden bytes, and it is called for
 * every URL that reaches nmfetch, including ones that arrive from a message attachment
 * or from a redirect Location header. An uncaught throw here takes the process down,
 * so a URL that does not parse is reported the same way as one with a scheme we refuse.
 *
 * @param url URL to parse
 * @returns Parsed URL, or false if it is not a usable http(s) URL
 */
function parseFetchUrl(url) {
    let parsed;
    try {
        parsed = urllib.parse(url);
    }
    catch (_err) {
        return false;
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return false;
    }
    return parsed;
}
function nmfetch(url, options) {
    options = options || {};
    options.fetchRes = options.fetchRes || new node_stream_1.PassThrough();
    options.cookies = options.cookies || new cookies_js_1.default();
    options.redirects = options.redirects || 0;
    options.maxRedirects = isNaN(options.maxRedirects) ? MAX_REDIRECTS : options.maxRedirects;
    const fetchRes = options.fetchRes;
    const parsed = parseFetchUrl(url);
    if (!parsed) {
        // Only http(s) URLs can be fetched. Any other scheme (file:, gopher:, a
        // protocol-relative redirect target etc.) would otherwise be silently served over
        // plain HTTP, possibly against an unintended host. Bail out before the cookie jar
        // is touched so a refused URL can not seed it, and release a caller supplied body:
        // this is the one exit that runs before the error handler below is attached to it,
        // so an error on that stream would have nowhere to go and the fd or socket behind
        // it would never be released.
        if (options.body && typeof options.body.destroy === 'function') {
            options.body.on('error', () => false);
            options.body.destroy();
        }
        setImmediate(() => {
            const err = new Error('Unsupported protocol for URL ' + url);
            err.code = errors.EFETCH;
            err.sourceUrl = url;
            fetchRes.emit('error', err);
        });
        return fetchRes;
    }
    if (options.cookie) {
        [].concat(options.cookie || []).forEach(cookie => {
            options.cookies.set(cookie, url);
        });
        options.cookie = false;
    }
    let method = (options.method || '').toString().trim().toUpperCase() || 'GET';
    let finished = false;
    let cookies;
    let body;
    const handler = parsed.protocol === 'https:' ? node_https_1.default : node_http_1.default;
    const headers = {
        'accept-encoding': 'gzip,deflate',
        'user-agent': 'nodemailer/' + packageData.version
    };
    Object.keys(options.headers || {}).forEach(key => {
        // options.headers is the caller's httpHeaders, straight off an attachment
        if ((0, objects_js_1.isProtoKey)(key.toLowerCase().trim())) {
            return;
        }
        headers[key.toLowerCase().trim()] = options.headers[key];
    });
    if (options.userAgent) {
        headers['user-agent'] = options.userAgent;
    }
    if (parsed.auth) {
        headers.Authorization = 'Basic ' + Buffer.from(parsed.auth).toString('base64');
    }
    if ((cookies = options.cookies.get(url))) {
        headers.cookie = cookies;
    }
    if (options.body) {
        if (options.contentType !== false) {
            headers['Content-Type'] = options.contentType || 'application/x-www-form-urlencoded';
        }
        if (typeof options.body.pipe === 'function') {
            // it's a stream
            headers['Transfer-Encoding'] = 'chunked';
            body = options.body;
            body.on('error', (err) => {
                if (finished) {
                    return;
                }
                finished = true;
                err.code = errors.EFETCH;
                err.sourceUrl = url;
                fetchRes.emit('error', err);
            });
        }
        else {
            if (options.body instanceof Buffer) {
                body = options.body;
            }
            else if (typeof options.body === 'object') {
                try {
                    // encodeURIComponent can fail on invalid input (partial emoji etc.)
                    body = Buffer.from(Object.keys(options.body)
                        .map(key => {
                        const value = options.body[key].toString().trim();
                        return encodeURIComponent(key) + '=' + encodeURIComponent(value);
                    })
                        .join('&'));
                }
                catch (E) {
                    if (finished) {
                        return undefined;
                    }
                    finished = true;
                    E.code = errors.EFETCH;
                    E.sourceUrl = url;
                    fetchRes.emit('error', E);
                    return undefined;
                }
            }
            else {
                body = Buffer.from(options.body.toString().trim());
            }
            headers['Content-Type'] = options.contentType || 'application/x-www-form-urlencoded';
            headers['Content-Length'] = body.length;
        }
        // if method is not provided, use POST instead of GET
        method = (options.method || '').toString().trim().toUpperCase() || 'POST';
    }
    let req;
    const reqOptions = {
        method,
        host: parsed.hostname,
        path: parsed.path,
        port: parsed.port ? parsed.port : parsed.protocol === 'https:' ? 443 : 80,
        headers,
        // Validate TLS certificates by default. Callers that genuinely need to
        // reach a self-signed/internal host opt out explicitly with
        // options.tls = { rejectUnauthorized: false }.
        rejectUnauthorized: true,
        agent: false
    };
    if (options.tls) {
        // see TLS_OPTION_KEYS
        Object.keys(options.tls).forEach(key => {
            if (TLS_OPTION_KEYS.includes(key)) {
                reqOptions[key] = options.tls[key];
            }
        });
    }
    if (parsed.protocol === 'https:' &&
        parsed.hostname &&
        parsed.hostname !== reqOptions.host &&
        !node_net_1.default.isIP(parsed.hostname) &&
        !reqOptions.servername) {
        reqOptions.servername = parsed.hostname;
    }
    try {
        req = handler.request(reqOptions);
    }
    catch (E) {
        finished = true;
        setImmediate(() => {
            E.code = errors.EFETCH;
            E.sourceUrl = url;
            fetchRes.emit('error', E);
        });
        return fetchRes;
    }
    if (options.timeout) {
        req.setTimeout(options.timeout, () => {
            if (finished) {
                return;
            }
            finished = true;
            req.abort();
            const err = new Error('Request Timeout');
            err.code = errors.EFETCH;
            err.sourceUrl = url;
            fetchRes.emit('error', err);
        });
    }
    req.on('error', (err) => {
        if (finished) {
            return;
        }
        finished = true;
        err.code = errors.EFETCH;
        err.sourceUrl = url;
        fetchRes.emit('error', err);
    });
    req.on('response', res => {
        let inflate;
        if (finished) {
            return;
        }
        switch (res.headers['content-encoding']) {
            case 'gzip':
            case 'deflate':
                inflate = node_zlib_1.default.createUnzip();
                break;
        }
        if (res.headers['set-cookie']) {
            [].concat(res.headers['set-cookie'] || []).forEach(cookie => {
                options.cookies.set(cookie, url);
            });
        }
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
            // redirect
            options.redirects++;
            if (options.redirects > options.maxRedirects) {
                finished = true;
                const err = new Error('Maximum redirect count exceeded');
                err.code = errors.EFETCH;
                err.sourceUrl = url;
                fetchRes.emit('error', err);
                req.abort();
                return;
            }
            // redirect does not include POST body
            options.method = 'GET';
            options.body = false;
            let redirectUrl;
            try {
                redirectUrl = urllib.resolve(url, res.headers.location);
            }
            catch (_err) {
                // the legacy resolver throws on a Location the WHATWG parser also refused,
                // so fall through to the check below with what the server actually sent
                redirectUrl = res.headers.location;
            }
            const redirectParsed = parseFetchUrl(redirectUrl);
            if (!redirectParsed) {
                // Refuse the redirect target here rather than leaving it to the recursive
                // call: that call gets its own `finished` flag and no handle on this
                // request, so this one would stay open and could emit a second error on
                // the shared fetchRes once it times out. Callers listen with req.once().
                finished = true;
                const err = new Error('Unsupported protocol for URL ' + redirectUrl);
                err.code = errors.EFETCH;
                err.sourceUrl = redirectUrl;
                fetchRes.emit('error', err);
                req.abort();
                return;
            }
            // Do not forward credentials when the redirect leaves the original
            // security context: a different host, or a downgrade from https to
            // http (which would otherwise put them on the wire in cleartext).
            // Strip sensitive request headers so an attacker who controls the
            // redirect target cannot harvest them.
            const crossHost = redirectParsed.hostname !== parsed.hostname;
            const downgrade = parsed.protocol === 'https:' && redirectParsed.protocol === 'http:';
            if (options.headers && (crossHost || downgrade)) {
                const sensitive = ['authorization', 'cookie', 'proxy-authorization'];
                Object.keys(options.headers).forEach(key => {
                    if (sensitive.includes(key.toLowerCase())) {
                        delete options.headers[key];
                    }
                });
            }
            return nmfetch(redirectUrl, options);
        }
        fetchRes.statusCode = res.statusCode;
        fetchRes.headers = res.headers;
        if (res.statusCode >= 300 && !options.allowErrorResponse) {
            finished = true;
            const err = new Error('Invalid status code ' + res.statusCode);
            err.code = errors.EFETCH;
            err.sourceUrl = url;
            fetchRes.emit('error', err);
            req.abort();
            return;
        }
        res.on('error', (err) => {
            if (finished) {
                return;
            }
            finished = true;
            err.code = errors.EFETCH;
            err.sourceUrl = url;
            fetchRes.emit('error', err);
            req.abort();
        });
        if (inflate) {
            res.pipe(inflate).pipe(fetchRes);
            inflate.on('error', (err) => {
                if (finished) {
                    return;
                }
                finished = true;
                err.code = errors.EFETCH;
                err.sourceUrl = url;
                fetchRes.emit('error', err);
                req.abort();
            });
        }
        else {
            res.pipe(fetchRes);
        }
    });
    setImmediate(() => {
        if (body) {
            try {
                if (typeof body.pipe === 'function') {
                    return body.pipe(req);
                }
                req.write(body);
            }
            catch (err) {
                finished = true;
                err.code = errors.EFETCH;
                err.sourceUrl = url;
                fetchRes.emit('error', err);
                return;
            }
        }
        req.end();
    });
    return fetchRes;
}
nmfetch.Cookies = cookies_js_1.default;
exports["default"] = nmfetch;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 6518:
/***/ (function(module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
const packageData = __importStar(__nccwpck_require__(5552));
const shared = __importStar(__nccwpck_require__(9893));
/**
 * Generates a Transport object to generate JSON output
 *
 * @constructor
 * @param optional config parameter
 */
class JSONTransport {
    constructor(options) {
        options = options || {};
        this.options = options;
        this.name = 'JSONTransport';
        this.version = packageData.version;
        this.logger = shared.getLogger(this.options, {
            component: this.options.component || 'json-transport'
        });
    }
    /**
     * <p>Compiles a mailcomposer message and forwards it to handler that sends it.</p>
     *
     * @param mail MailComposer object
     * @param done Callback function to run when the sending is completed
     */
    send(mail, done) {
        // Sendmail strips this header line by itself. send() runs after the message was
        // compiled, so mail.message is set
        mail.message.keepBcc = true;
        const envelope = mail.message.getEnvelope();
        const messageId = mail.message.messageId();
        const recipients = [].concat(envelope.to || []);
        if (recipients.length > 3) {
            recipients.push('...and ' + recipients.splice(2).length + ' more');
        }
        this.logger.info({
            tnx: 'send',
            messageId
        }, 'Composing JSON structure of %s to <%s>', messageId, recipients.join(', '));
        setImmediate(() => {
            mail.normalize((err, data) => {
                if (err) {
                    this.logger.error({
                        err,
                        tnx: 'send',
                        messageId
                    }, 'Failed building JSON structure for %s. %s', messageId, err.message);
                    return done(err);
                }
                delete data.envelope;
                delete data.normalizedHeaders;
                return done(null, {
                    envelope,
                    messageId,
                    message: this.options.skipEncoding ? data : JSON.stringify(data)
                });
            });
        });
    }
}
exports["default"] = JSONTransport;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 7164:
/***/ (function(module, exports, __nccwpck_require__) {


/* eslint no-undefined: 0 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const index_js_1 = __importDefault(__nccwpck_require__(1915));
const mimeFuncs = __importStar(__nccwpck_require__(1038));
const index_js_2 = __nccwpck_require__(9893);
/**
 * Creates the object for composing a MimeNode instance out from the mail options
 *
 * @constructor
 * @param mail Mail options
 */
/**
 * Tells whether a content value is a content descriptor object (something to load or to
 * use as is) rather than the content itself
 */
function isContentObject(value) {
    const content = value;
    return typeof value === 'object' && !!(content.content || content.path || content.href || content.raw);
}
class MailComposer {
    constructor(mail) {
        this.mail = mail || {};
        this.message = false;
    }
    /**
     * Builds MimeNode instance
     */
    compile() {
        this._alternatives = this.getAlternatives();
        this._htmlNode = this._alternatives.filter(alternative => /^text\/html\b/i.test(alternative.contentType)).pop();
        this._attachments = this.getAttachments(!!this._htmlNode);
        this._useRelated = !!(this._htmlNode && this._attachments.related.length);
        this._useAlternative = this._alternatives.length > 1;
        this._useMixed = this._attachments.attached.length > 1 || (this._alternatives.length && this._attachments.attached.length === 1);
        // Compose MIME tree
        if (this.mail.raw) {
            this.message = new index_js_1.default('message/rfc822', {
                newline: this.mail.newline,
                disableUrlAccess: this.mail.disableUrlAccess,
                disableFileAccess: this.mail.disableFileAccess
            }).setRaw(this.mail.raw);
        }
        else if (this._useMixed) {
            this.message = this._createMixed();
        }
        else if (this._useAlternative) {
            this.message = this._createAlternative();
        }
        else if (this._useRelated) {
            this.message = this._createRelated();
        }
        else {
            this.message = this._createContentNode(false, []
                .concat(this._alternatives || [])
                .concat(this._attachments.attached || [])
                .shift() || {
                contentType: 'text/plain',
                content: ''
            });
        }
        // Add custom headers
        if (this.mail.headers) {
            this.message.addHeader(this.mail.headers);
        }
        // Add headers to the root node, always overrides custom headers
        ['from', 'sender', 'to', 'cc', 'bcc', 'reply-to', 'in-reply-to', 'references', 'subject', 'message-id', 'date'].forEach(header => {
            const key = header.replace(/-(\w)/g, (o, c) => c.toUpperCase());
            if (this.mail[key]) {
                this.message.setHeader(header, this.mail[key]);
            }
        });
        // Sets custom envelope
        if (this.mail.envelope) {
            this.message.setEnvelope(this.mail.envelope);
        }
        // ensure Message-Id value
        this.message.messageId();
        return this.message;
    }
    /**
     * List all attachments. Resulting attachment objects can be used as input for MimeNode nodes
     *
     * @param findRelated If true separate related attachments from attached ones
     * @returns An object of arrays (`related` and `attached`)
     */
    getAttachments(findRelated) {
        let eventObject;
        const attachments = [].concat(this.mail.attachments || []).map((attachment, i) => {
            if (/^data:/i.test((attachment.path || attachment.href))) {
                attachment = this._processDataUrl(attachment);
            }
            const contentType = attachment.contentType || mimeFuncs.detectMimeType(attachment.filename || attachment.path || attachment.href || 'bin');
            const isImage = /^image\//i.test(contentType);
            const isMessageNode = /^message\//i.test(contentType);
            const contentDisposition = attachment.contentDisposition || (isMessageNode || (isImage && attachment.cid) ? 'inline' : 'attachment');
            let contentTransferEncoding;
            if ('contentTransferEncoding' in attachment) {
                // also contains `false`, to set
                contentTransferEncoding = attachment.contentTransferEncoding;
            }
            else if (isMessageNode) {
                // the content might include non-ASCII bytes but at this point we do not know it yet
                contentTransferEncoding = '8bit';
            }
            else {
                contentTransferEncoding = 'base64'; // the default
            }
            const data = {
                contentType,
                contentDisposition,
                contentTransferEncoding
            };
            if (attachment.filename) {
                data.filename = attachment.filename;
            }
            else if (!isMessageNode && attachment.filename !== false) {
                data.filename =
                    (attachment.path || attachment.href || '').split('/').pop().split('?').shift() || 'attachment-' + (i + 1);
                if (data.filename.indexOf('.') < 0) {
                    data.filename += '.' + mimeFuncs.detectExtension(data.contentType);
                }
            }
            if (/^https?:\/\//i.test(attachment.path)) {
                attachment.href = attachment.path;
                attachment.path = undefined;
            }
            if (attachment.cid) {
                data.cid = attachment.cid;
            }
            if (attachment.raw) {
                data.raw = attachment.raw;
            }
            else if (attachment.path) {
                data.content = {
                    path: attachment.path
                };
            }
            else if (attachment.href) {
                data.content = {
                    href: attachment.href,
                    httpHeaders: attachment.httpHeaders,
                    tls: attachment.tls
                };
            }
            else {
                data.content = attachment.content || '';
            }
            if (attachment.encoding) {
                data.encoding = attachment.encoding;
            }
            if (attachment.headers) {
                data.headers = attachment.headers;
            }
            return data;
        });
        if (this.mail.icalEvent) {
            eventObject = Object.assign({}, this._getIcalEvent());
            eventObject.contentType = 'application/ics';
            if (!eventObject.headers) {
                eventObject.headers = {};
            }
            eventObject.filename = eventObject.filename || 'invite.ics';
            eventObject.headers['Content-Disposition'] = 'attachment';
            eventObject.headers['Content-Transfer-Encoding'] = 'base64';
        }
        if (!findRelated) {
            return {
                attached: attachments.concat(eventObject || []),
                related: []
            };
        }
        return {
            attached: attachments.filter(attachment => !attachment.cid).concat(eventObject || []),
            related: attachments.filter(attachment => !!attachment.cid)
        };
    }
    /**
     * Returns the icalEvent value with `path`/`href`/data uri input normalized into
     * a `content` entry, the same way as for regular attachments. The same event is
     * included twice (as a text/calendar alternative and as an application/ics
     * attachment), so the shared content object is marked to be resolved just once
     * and the buffered result is reused by the second node.
     *
     * @returns Normalized icalEvent data
     */
    _getIcalEvent() {
        if (!this._icalEvent) {
            let icalEvent;
            if (isContentObject(this.mail.icalEvent)) {
                // an own "__proto__" key would make the copy inherit path/href from caller
                // data, and the mapping below then replaces the content the caller did set
                icalEvent = (0, index_js_2.copyOwnKeys)({}, this.mail.icalEvent);
            }
            else {
                icalEvent = {
                    content: this.mail.icalEvent
                };
            }
            if (/^data:/i.test((icalEvent.path || icalEvent.href))) {
                icalEvent = this._processDataUrl(icalEvent);
            }
            if (/^https?:\/\//i.test(icalEvent.path)) {
                icalEvent.href = icalEvent.path;
                icalEvent.path = undefined;
            }
            if (!icalEvent.raw) {
                // map file path and URL values into `content`, otherwise the content
                // nodes would render an empty body
                if (icalEvent.path) {
                    icalEvent.content = {
                        path: icalEvent.path
                    };
                    icalEvent.path = undefined;
                }
                else if (icalEvent.href) {
                    icalEvent.content = {
                        href: icalEvent.href,
                        httpHeaders: icalEvent.httpHeaders
                    };
                    icalEvent.href = undefined;
                }
            }
            if (icalEvent.content && typeof icalEvent.content === 'object') {
                // we are going to have the same attachment twice, so mark this to be
                // resolved just once
                icalEvent.content._resolve = true;
            }
            this._icalEvent = icalEvent;
        }
        return this._icalEvent;
    }
    /**
     * List alternatives. Resulting objects can be used as input for MimeNode nodes
     *
     * @returns An array of alternative elements. Includes the `text` and `html` values as well
     */
    getAlternatives() {
        const alternatives = [];
        let text, html, watchHtml, amp, eventObject;
        if (this.mail.text) {
            if (isContentObject(this.mail.text)) {
                text = this.mail.text;
            }
            else {
                text = {
                    content: this.mail.text
                };
            }
            text.contentType = 'text/plain; charset=utf-8';
        }
        if (this.mail.watchHtml) {
            if (isContentObject(this.mail.watchHtml)) {
                watchHtml = this.mail.watchHtml;
            }
            else {
                watchHtml = {
                    content: this.mail.watchHtml
                };
            }
            watchHtml.contentType = 'text/watch-html; charset=utf-8';
        }
        if (this.mail.amp) {
            if (isContentObject(this.mail.amp)) {
                amp = this.mail.amp;
            }
            else {
                amp = {
                    content: this.mail.amp
                };
            }
            amp.contentType = 'text/x-amp-html; charset=utf-8';
        }
        // NB! when including attachments with a calendar alternative you might end up in a blank screen on some clients
        if (this.mail.icalEvent) {
            eventObject = Object.assign({}, this._getIcalEvent());
            eventObject.filename = false;
            eventObject.contentType =
                'text/calendar; charset=utf-8; method=' + (eventObject.method || 'PUBLISH').toString().trim().toUpperCase();
            if (!eventObject.headers) {
                eventObject.headers = {};
            }
        }
        if (this.mail.html) {
            if (isContentObject(this.mail.html)) {
                html = this.mail.html;
            }
            else {
                html = {
                    content: this.mail.html
                };
            }
            html.contentType = 'text/html; charset=utf-8';
        }
        []
            .concat(text || [])
            .concat(watchHtml || [])
            .concat(amp || [])
            .concat(html || [])
            .concat(eventObject || [])
            .concat(this.mail.alternatives || [])
            .forEach(alternative => {
            if (/^data:/i.test((alternative.path || alternative.href))) {
                alternative = this._processDataUrl(alternative);
            }
            const data = {
                contentType: alternative.contentType ||
                    mimeFuncs.detectMimeType(alternative.filename || alternative.path || alternative.href || 'txt'),
                contentTransferEncoding: alternative.contentTransferEncoding
            };
            if (alternative.filename) {
                data.filename = alternative.filename;
            }
            if (/^https?:\/\//i.test(alternative.path)) {
                alternative.href = alternative.path;
                alternative.path = undefined;
            }
            if (alternative.raw) {
                data.raw = alternative.raw;
            }
            else if (alternative.path) {
                data.content = {
                    path: alternative.path
                };
            }
            else if (alternative.href) {
                data.content = {
                    href: alternative.href
                };
            }
            else {
                data.content = alternative.content || '';
            }
            if (alternative.encoding) {
                data.encoding = alternative.encoding;
            }
            if (alternative.headers) {
                data.headers = alternative.headers;
            }
            alternatives.push(data);
        });
        return alternatives;
    }
    /**
     * Builds multipart/mixed node. It should always contain different type of elements on the same level
     * eg. text + attachments
     *
     * @param parentNode Parent for this note. If it does not exist, a root node is created
     * @returns MimeNode node element
     */
    _createMixed(parentNode) {
        const node = parentNode
            ? parentNode.createChild('multipart/mixed', {
                disableUrlAccess: this.mail.disableUrlAccess,
                disableFileAccess: this.mail.disableFileAccess,
                normalizeHeaderKey: this.mail.normalizeHeaderKey,
                newline: this.mail.newline
            })
            : new index_js_1.default('multipart/mixed', {
                baseBoundary: this.mail.baseBoundary,
                textEncoding: this.mail.textEncoding,
                boundaryPrefix: this.mail.boundaryPrefix,
                disableUrlAccess: this.mail.disableUrlAccess,
                disableFileAccess: this.mail.disableFileAccess,
                normalizeHeaderKey: this.mail.normalizeHeaderKey,
                newline: this.mail.newline
            });
        if (this._useAlternative) {
            this._createAlternative(node);
        }
        else if (this._useRelated) {
            this._createRelated(node);
        }
        []
            .concat((!this._useAlternative && this._alternatives) || [])
            .concat(this._attachments.attached || [])
            .forEach(element => {
            // if the element is a html node from related subpart then ignore it
            if (!this._useRelated || element !== this._htmlNode) {
                this._createContentNode(node, element);
            }
        });
        return node;
    }
    /**
     * Builds multipart/alternative node. It should always contain same type of elements on the same level
     * eg. text + html view of the same data
     *
     * @param parentNode Parent for this note. If it does not exist, a root node is created
     * @returns MimeNode node element
     */
    _createAlternative(parentNode) {
        const node = parentNode
            ? parentNode.createChild('multipart/alternative', {
                disableUrlAccess: this.mail.disableUrlAccess,
                disableFileAccess: this.mail.disableFileAccess,
                normalizeHeaderKey: this.mail.normalizeHeaderKey,
                newline: this.mail.newline
            })
            : new index_js_1.default('multipart/alternative', {
                baseBoundary: this.mail.baseBoundary,
                textEncoding: this.mail.textEncoding,
                boundaryPrefix: this.mail.boundaryPrefix,
                disableUrlAccess: this.mail.disableUrlAccess,
                disableFileAccess: this.mail.disableFileAccess,
                normalizeHeaderKey: this.mail.normalizeHeaderKey,
                newline: this.mail.newline
            });
        this._alternatives.forEach(alternative => {
            if (this._useRelated && this._htmlNode === alternative) {
                this._createRelated(node);
            }
            else {
                this._createContentNode(node, alternative);
            }
        });
        return node;
    }
    /**
     * Builds multipart/related node. It should always contain html node with related attachments
     *
     * @param parentNode Parent for this note. If it does not exist, a root node is created
     * @returns MimeNode node element
     */
    _createRelated(parentNode) {
        const node = parentNode
            ? parentNode.createChild('multipart/related; type="text/html"', {
                disableUrlAccess: this.mail.disableUrlAccess,
                disableFileAccess: this.mail.disableFileAccess,
                normalizeHeaderKey: this.mail.normalizeHeaderKey,
                newline: this.mail.newline
            })
            : new index_js_1.default('multipart/related; type="text/html"', {
                baseBoundary: this.mail.baseBoundary,
                textEncoding: this.mail.textEncoding,
                boundaryPrefix: this.mail.boundaryPrefix,
                disableUrlAccess: this.mail.disableUrlAccess,
                disableFileAccess: this.mail.disableFileAccess,
                normalizeHeaderKey: this.mail.normalizeHeaderKey,
                newline: this.mail.newline
            });
        this._createContentNode(node, this._htmlNode);
        this._attachments.related.forEach(alternative => this._createContentNode(node, alternative));
        return node;
    }
    /**
     * Creates a regular node with contents
     *
     * @param parentNode Parent for this note. If it does not exist, a root node is created
     * @param element Node data
     * @returns MimeNode node element
     */
    _createContentNode(parentNode, element) {
        element = element || {};
        element.content = element.content || '';
        const encoding = (element.encoding || 'utf8')
            .toString()
            .toLowerCase()
            .replace(/[-_\s]/g, '');
        const node = parentNode
            ? parentNode.createChild(element.contentType, {
                filename: element.filename,
                textEncoding: this.mail.textEncoding,
                disableUrlAccess: this.mail.disableUrlAccess,
                disableFileAccess: this.mail.disableFileAccess,
                normalizeHeaderKey: this.mail.normalizeHeaderKey,
                newline: this.mail.newline
            })
            : new index_js_1.default(element.contentType, {
                filename: element.filename,
                baseBoundary: this.mail.baseBoundary,
                textEncoding: this.mail.textEncoding,
                boundaryPrefix: this.mail.boundaryPrefix,
                disableUrlAccess: this.mail.disableUrlAccess,
                disableFileAccess: this.mail.disableFileAccess,
                normalizeHeaderKey: this.mail.normalizeHeaderKey,
                newline: this.mail.newline
            });
        // add custom headers
        if (element.headers) {
            node.addHeader(element.headers);
        }
        if (element.cid) {
            node.setHeader('Content-Id', '<' + element.cid.replace(/[<>]/g, '') + '>');
        }
        if (element.contentTransferEncoding) {
            node.setHeader('Content-Transfer-Encoding', element.contentTransferEncoding);
        }
        else if (this.mail.encoding && /^text\//i.test(element.contentType)) {
            node.setHeader('Content-Transfer-Encoding', this.mail.encoding);
        }
        if (!/^text\//i.test(element.contentType) || element.contentDisposition) {
            node.setHeader('Content-Disposition', element.contentDisposition || (element.cid && /^image\//i.test(element.contentType) ? 'inline' : 'attachment'));
        }
        if (typeof element.content === 'string' && !['utf8', 'usascii', 'ascii'].includes(encoding)) {
            element.content = Buffer.from(element.content, encoding);
        }
        // prefer pregenerated raw content
        if (element.raw) {
            node.setRaw(element.raw);
        }
        else {
            node.setContent(element.content);
        }
        return node;
    }
    /**
     * Parses data uri and converts it to a Buffer
     *
     * @param element Content element
     * @return Parsed element
     */
    _processDataUrl(element) {
        const dataUrl = element.path || element.href;
        // Early validation to prevent ReDoS
        if (!dataUrl || typeof dataUrl !== 'string') {
            return element;
        }
        if (!dataUrl.startsWith('data:')) {
            return element;
        }
        if (dataUrl.length > 52428800) {
            // 52428800 chars = 50MB limit for data URL string (~37.5MB decoded image)
            // Extract content type before rejecting to preserve MIME type
            let detectedType = 'application/octet-stream';
            const commaPos = dataUrl.indexOf(',');
            if (commaPos > 0 && commaPos < 200) {
                // Parse header safely with size limit
                const header = dataUrl.substring(5, commaPos); // skip 'data:'
                const parts = header.split(';');
                if (parts[0] && parts[0].includes('/')) {
                    detectedType = parts[0].trim();
                }
            }
            // Return empty content for excessively long data URLs
            return Object.assign((0, index_js_2.copyOwnKeys)({}, element), {
                path: false,
                href: false,
                content: Buffer.alloc(0),
                contentType: element.contentType || detectedType
            });
        }
        let parsedDataUri;
        try {
            parsedDataUri = (0, index_js_2.parseDataURI)(dataUrl);
        }
        catch (_err) {
            return element;
        }
        if (!parsedDataUri) {
            return element;
        }
        element.content = parsedDataUri.data;
        element.contentType = element.contentType || parsedDataUri.contentType;
        if ('path' in element) {
            element.path = false;
        }
        if ('href' in element) {
            element.href = false;
        }
        return element;
    }
}
exports["default"] = MailComposer;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 4844:
/***/ (function(module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const node_events_1 = __nccwpck_require__(8474);
const shared = __importStar(__nccwpck_require__(9893));
const mimeTypes = __importStar(__nccwpck_require__(276));
const index_js_1 = __importDefault(__nccwpck_require__(7164));
const index_js_2 = __importDefault(__nccwpck_require__(1967));
const http_proxy_client_js_1 = __importDefault(__nccwpck_require__(416));
const errors = __importStar(__nccwpck_require__(932));
const node_util_1 = __importDefault(__nccwpck_require__(7975));
const urllib = __importStar(__nccwpck_require__(2452));
const packageData = __importStar(__nccwpck_require__(5552));
const mail_message_js_1 = __importDefault(__nccwpck_require__(6107));
const node_net_1 = __importDefault(__nccwpck_require__(7030));
const node_dns_1 = __importDefault(__nccwpck_require__(610));
const node_crypto_1 = __importDefault(__nccwpck_require__(7598));
/**
 * Recipients allowed on one message unless the caller sets its own maxRecipients. A backstop
 * against a runaway or hostile recipient list rather than a delivery policy: RFC 5321 only
 * asks a server to accept 100, so a real send is bounded far below this.
 */
const DEFAULT_MAX_RECIPIENTS = 100000;
/**
 * Creates an object for exposing the Mail API
 *
 * @constructor
 * @param transporter Transport object instance to pass the mails to
 */
class Mail extends node_events_1.EventEmitter {
    constructor(transporter, options, defaults) {
        super();
        this.options = options || {};
        this._defaults = defaults || {};
        this._defaultPlugins = {
            compile: [(...args) => this._convertDataImages(...args)],
            stream: []
        };
        this._userPlugins = {
            compile: [],
            stream: []
        };
        this.meta = new Map();
        this.dkim = this.options.dkim ? new index_js_2.default(this.options.dkim) : false;
        this.transporter = transporter;
        this.transporter.mailer = this;
        this.logger = shared.getLogger(this.options, {
            component: this.options.component || 'mail'
        });
        this.logger.debug({
            tnx: 'create'
        }, 'Creating transport: %s', this.getVersionString());
        // setup emit handlers for the transporter
        if (typeof this.transporter.on === 'function') {
            // deprecated log interface
            this.transporter.on('log', log => {
                this.logger.debug({
                    tnx: 'transport'
                }, '%s: %s', log.type, log.message);
            });
            // transporter errors
            this.transporter.on('error', err => {
                this.logger.error({
                    err,
                    tnx: 'transport'
                }, 'Transport Error: %s', err.message);
                this.emit('error', err);
            });
            // indicates if the sender has became idle
            this.transporter.on('idle', (...args) => {
                this.emit('idle', ...args);
            });
            // indicates if the sender has became idle and all connections are terminated
            this.transporter.on('clear', (...args) => {
                this.emit('clear', ...args);
            });
        }
        /**
         * Optional methods passed to the underlying transport object
         */
        ['close', 'isIdle', 'verify'].forEach(method => {
            this[method] = (...args) => {
                if (typeof this.transporter[method] === 'function') {
                    if (method === 'verify' && typeof this.getSocket === 'function') {
                        this.transporter.getSocket = this.getSocket;
                        this.getSocket = false;
                    }
                    return this.transporter[method](...args);
                }
                this.logger.warn({
                    tnx: 'transport',
                    methodName: method
                }, 'Non existing method %s called for transport', method);
                return false;
            };
        });
        // setup proxy handling
        if (this.options.proxy && typeof this.options.proxy === 'string') {
            this.setupProxy(this.options.proxy);
        }
    }
    use(step, plugin) {
        step = (step || '').toString();
        if (!this._userPlugins.hasOwnProperty(step)) {
            this._userPlugins[step] = [plugin];
        }
        else {
            this._userPlugins[step].push(plugin);
        }
        return this;
    }
    sendMail(data, callback = null) {
        let promise;
        if (!callback) {
            promise = new Promise((resolve, reject) => {
                callback = shared.callbackPromise(resolve, reject);
            });
        }
        const done = callback;
        if (typeof this.getSocket === 'function') {
            this.transporter.getSocket = this.getSocket;
            this.getSocket = false;
        }
        const mail = new mail_message_js_1.default(this, data);
        this.logger.debug({
            tnx: 'transport',
            name: this.transporter.name,
            version: this.transporter.version,
            action: 'send'
        }, 'Sending mail using %s/%s', this.transporter.name, this.transporter.version);
        this._processPlugins('compile', mail, err => {
            if (err) {
                this.logger.error({
                    err,
                    tnx: 'plugin',
                    action: 'compile'
                }, 'PluginCompile Error: %s', err.message);
                return done(err);
            }
            mail.message = new index_js_1.default(mail.data).compile();
            mail.setMailerHeader();
            mail.setPriorityHeaders();
            mail.setListHeaders();
            const maxRecipients = mail.data.maxRecipients === undefined ? DEFAULT_MAX_RECIPIENTS : mail.data.maxRecipients;
            const recipientCount = mail.message.getEnvelope().to.length;
            if (maxRecipients && recipientCount > maxRecipients) {
                const err = new Error(`Message has ${recipientCount} recipients, which is over the ${maxRecipients} allowed by maxRecipients`);
                err.code = errors.EMAXRECIPIENTS;
                this.logger.error({
                    err,
                    tnx: 'transport',
                    action: 'send'
                }, 'Send Error: %s', err.message);
                return done(err);
            }
            this._processPlugins('stream', mail, err => {
                if (err) {
                    this.logger.error({
                        err,
                        tnx: 'plugin',
                        action: 'stream'
                    }, 'PluginStream Error: %s', err.message);
                    return done(err);
                }
                if (mail.data.dkim || this.dkim) {
                    mail.message.processFunc(input => {
                        const dkim = mail.data.dkim ? new index_js_2.default(mail.data.dkim) : this.dkim;
                        this.logger.debug({
                            tnx: 'DKIM',
                            messageId: mail.message.messageId(),
                            dkimDomains: dkim.keys.map(key => key.keySelector + '.' + key.domainName).join(', ')
                        }, 'Signing outgoing message with %s keys', dkim.keys.length);
                        return dkim.sign(input, mail.data._dkim);
                    });
                }
                this.transporter.send(mail, (...args) => {
                    if (args[0]) {
                        this.logger.error({
                            err: args[0],
                            tnx: 'transport',
                            action: 'send'
                        }, 'Send Error: %s', args[0].message);
                    }
                    done(...args);
                });
            });
        });
        return promise;
    }
    getVersionString() {
        return node_util_1.default.format('%s (%s; +%s; %s/%s)', packageData.name, packageData.version, packageData.homepage, this.transporter.name, this.transporter.version);
    }
    _processPlugins(step, mail, callback) {
        step = (step || '').toString();
        if (!this._userPlugins.hasOwnProperty(step)) {
            return callback();
        }
        const userPlugins = this._userPlugins[step] || [];
        const defaultPlugins = this._defaultPlugins[step] || [];
        if (userPlugins.length) {
            this.logger.debug({
                tnx: 'transaction',
                pluginCount: userPlugins.length,
                step
            }, 'Using %s plugins for %s', userPlugins.length, step);
        }
        if (userPlugins.length + defaultPlugins.length === 0) {
            return callback();
        }
        let pos = 0;
        let block = 'default';
        const processPlugins = () => {
            let curplugins = block === 'default' ? defaultPlugins : userPlugins;
            if (pos >= curplugins.length) {
                if (block === 'default' && userPlugins.length) {
                    block = 'user';
                    pos = 0;
                    curplugins = userPlugins;
                }
                else {
                    return callback();
                }
            }
            const plugin = curplugins[pos++];
            plugin(mail, err => {
                if (err) {
                    return callback(err);
                }
                processPlugins();
            });
        };
        processPlugins();
    }
    /**
     * Sets up proxy handler for a Nodemailer object
     *
     * @param proxyUrl Proxy configuration url
     */
    setupProxy(proxyUrl) {
        const proxy = urllib.parse(proxyUrl);
        // setup socket handler for the mailer object
        this.getSocket = (options, callback) => {
            const protocol = proxy.protocol.replace(/:$/, '').toLowerCase();
            if (this.meta.has('proxy_handler_' + protocol)) {
                return this.meta.get('proxy_handler_' + protocol)(proxy, options, callback);
            }
            switch (protocol) {
                // Connect using a HTTP CONNECT method
                case 'http':
                case 'https':
                    (0, http_proxy_client_js_1.default)(proxy.href, options.port, options.host, this.options.tls || {}, (err, socket) => {
                        if (err) {
                            return callback(err);
                        }
                        return callback(null, {
                            connection: socket
                        });
                    });
                    return;
                case 'socks':
                case 'socks5':
                case 'socks4':
                case 'socks4a': {
                    if (!this.meta.has('proxy_socks_module')) {
                        let err = new Error('Socks module not loaded');
                        err.code = errors.EPROXY;
                        return callback(err);
                    }
                    const connect = (ipaddress) => {
                        const proxyV2 = !!this.meta.get('proxy_socks_module').SocksClient;
                        const socksClient = proxyV2 ? this.meta.get('proxy_socks_module').SocksClient : this.meta.get('proxy_socks_module');
                        const proxyType = Number(proxy.protocol.replace(/\D/g, '')) || 5;
                        const connectionOpts = {
                            proxy: {
                                ipaddress,
                                port: Number(proxy.port),
                                type: proxyType
                            },
                            [proxyV2 ? 'destination' : 'target']: {
                                host: options.host,
                                port: options.port
                            },
                            command: 'connect'
                        };
                        if (proxy.username || proxy.password) {
                            const username = proxy.username || '';
                            const password = proxy.password || '';
                            if (proxyV2) {
                                connectionOpts.proxy.userId = username;
                                connectionOpts.proxy.password = password;
                            }
                            else if (proxyType === 4) {
                                connectionOpts.userid = username;
                            }
                            else {
                                connectionOpts.authentication = {
                                    username,
                                    password
                                };
                            }
                        }
                        socksClient.createConnection(connectionOpts, (err, info) => {
                            if (err) {
                                return callback(err);
                            }
                            return callback(null, {
                                connection: info.socket || info
                            });
                        });
                    };
                    if (node_net_1.default.isIP(proxy.hostname)) {
                        return connect(proxy.hostname);
                    }
                    return node_dns_1.default.resolve(proxy.hostname, (err, address) => {
                        if (err) {
                            return callback(err);
                        }
                        connect(Array.isArray(address) ? address[0] : address);
                    });
                }
            }
            let err = new Error('Unknown proxy configuration');
            err.code = errors.EPROXY;
            callback(err);
        };
    }
    _convertDataImages(mail, callback) {
        if ((!this.options.attachDataUrls && !mail.data.attachDataUrls) || !mail.data.html) {
            return callback();
        }
        mail.resolveContent(mail.data, 'html', { disableFileAccess: mail.data.disableFileAccess, disableUrlAccess: mail.data.disableUrlAccess }, (err, html) => {
            if (err) {
                return callback(err);
            }
            let cidCounter = 0;
            html = (html || '')
                .toString()
                .replace(/(<img\b[^<>]{0,1024} src\s{0,20}=[\s"']{0,20})(data:([^;]+);[^"'>\s]+)/gi, (match, prefix, dataUri, mimeType) => {
                const cid = node_crypto_1.default.randomBytes(10).toString('hex') + '@localhost';
                if (!mail.data.attachments) {
                    mail.data.attachments = [];
                }
                if (!Array.isArray(mail.data.attachments)) {
                    mail.data.attachments = [].concat(mail.data.attachments || []);
                }
                mail.data.attachments.push({
                    path: dataUri,
                    cid,
                    filename: 'image-' + ++cidCounter + '.' + mimeTypes.detectExtension(mimeType)
                });
                return prefix + 'cid:' + cid;
            });
            mail.data.html = html;
            callback();
        });
    }
    set(key, value) {
        return this.meta.set(key, value);
    }
    get(key) {
        return this.meta.get(key);
    }
}
exports["default"] = Mail;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 6107:
/***/ (function(module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const shared = __importStar(__nccwpck_require__(9893));
const index_js_1 = __importDefault(__nccwpck_require__(1915));
const mimeFuncs = __importStar(__nccwpck_require__(1038));
// Only an own key counts as already set. `key in obj` also matches every member of
// Object.prototype, which silently drops a transporter default legitimately named
// toString or constructor.
const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
class MailMessage {
    constructor(mailer, data) {
        this.mailer = mailer;
        this.data = {};
        this.message = null;
        data = data || {};
        const options = mailer.options || {};
        const defaults = mailer._defaults || {};
        shared.copyOwnKeys(this.data, data);
        this.data.headers = this.data.headers || {};
        // Apply defaults. `_defaults` is caller supplied too, it is the second argument of
        // createTransport, so it needs the same treatment as `data` above
        shared.copyOwnKeys(this.data, defaults, key => hasOwn(this.data, key));
        // headers is a special case. Allow setting individual default headers
        shared.copyOwnKeys(this.data.headers, defaults.headers, key => hasOwn(this.data.headers, key));
        // force specific keys from transporter options
        ['disableFileAccess', 'disableUrlAccess', 'normalizeHeaderKey', 'maxRecipients'].forEach(key => {
            if (key in options) {
                this.data[key] = options[key];
            }
        });
        // The access flags are a sandbox rather than a message field, so `defaults` counts as
        // transporter configuration for them. For a transporter plugin it is the only channel
        // there is, createTransport leaves `options` undefined for one, and the defaults copy
        // above yields to anything the message already set, which let message data switch the
        // sandbox back off. Closing is one way here, same as in resolveContent below: either
        // side may switch a flag on, neither can switch off what the other closed.
        ['disableFileAccess', 'disableUrlAccess'].forEach(key => {
            if (!(key in options) && hasOwn(defaults, key)) {
                this.data[key] = this.data[key] || defaults[key];
            }
        });
    }
    resolveContent(data, key, options, callback) {
        // Most plugins call this with the legacy (data, key, callback) signature, which carries
        // no access policy. The policy belongs to the message, so apply it here. Explicit
        // options may only tighten it, never reopen what the transporter closed.
        if (!callback && typeof options === 'function') {
            callback = options;
            options = false;
        }
        options = options || {};
        const policy = {
            disableFileAccess: this.data.disableFileAccess || options.disableFileAccess,
            disableUrlAccess: this.data.disableUrlAccess || options.disableUrlAccess
        };
        return shared.resolveContent(data, key, policy, callback);
    }
    resolveAll(callback) {
        const keys = [
            [this.data, 'html'],
            [this.data, 'text'],
            [this.data, 'watchHtml'],
            [this.data, 'amp'],
            [this.data, 'icalEvent']
        ];
        if (this.data.alternatives && this.data.alternatives.length) {
            this.data.alternatives.forEach((alternative, i) => {
                keys.push([this.data.alternatives, i]);
            });
        }
        if (this.data.attachments && this.data.attachments.length) {
            this.data.attachments.forEach((attachment, i) => {
                if (!attachment.filename) {
                    attachment.filename =
                        (attachment.path || attachment.href || '').split('/').pop().split('?').shift() ||
                            'attachment-' + (i + 1);
                    if (attachment.filename.indexOf('.') < 0) {
                        attachment.filename += '.' + mimeFuncs.detectExtension(attachment.contentType);
                    }
                }
                if (!attachment.contentType) {
                    attachment.contentType = mimeFuncs.detectMimeType(attachment.filename || attachment.path || attachment.href || 'bin');
                }
                keys.push([this.data.attachments, i]);
            });
        }
        const mimeNode = new index_js_1.default();
        const addressKeys = ['from', 'to', 'cc', 'bcc', 'sender', 'replyTo'];
        addressKeys.forEach(address => {
            let value;
            if (this.message) {
                value = [].concat(mimeNode._parseAddresses(this.message.getHeader(address === 'replyTo' ? 'reply-to' : address)) || []);
            }
            else if (this.data[address]) {
                value = [].concat(mimeNode._parseAddresses(this.data[address]) || []);
            }
            if (value && value.length) {
                this.data[address] = value;
            }
            else if (address in this.data) {
                this.data[address] = null;
            }
        });
        const singleKeys = ['from', 'sender'];
        singleKeys.forEach(address => {
            if (this.data[address]) {
                this.data[address] = this.data[address].shift();
            }
        });
        let pos = 0;
        const resolveNext = () => {
            if (pos >= keys.length) {
                return callback(null, this.data);
            }
            const args = keys[pos++];
            if (!args[0] || !args[0][args[1]]) {
                return resolveNext();
            }
            shared.resolveContent(...args, { disableFileAccess: this.data.disableFileAccess, disableUrlAccess: this.data.disableUrlAccess }, (err, value) => {
                if (err) {
                    return callback(err);
                }
                const node = {
                    content: value
                };
                if (args[0][args[1]] && typeof args[0][args[1]] === 'object' && !Buffer.isBuffer(args[0][args[1]])) {
                    // The keys are the caller's, so copying them takes the same "__proto__"
                    // rule as the constructor. `key in node` stays as the already-set test
                    // here, unlike for the defaults: it also skips the Object.prototype
                    // member names, and letting message data land a `toString` string on a
                    // node only buys a TypeError the first time something stringifies it.
                    shared.copyOwnKeys(node, args[0][args[1]], key => key in node || ['content', 'path', 'href', 'raw'].includes(key));
                }
                args[0][args[1]] = node;
                resolveNext();
            });
        };
        setImmediate(() => resolveNext());
    }
    normalize(callback) {
        const envelope = this.message.getEnvelope();
        const messageId = this.message.messageId();
        this.resolveAll((err, data) => {
            if (err) {
                return callback(err);
            }
            data.envelope = envelope;
            data.messageId = messageId;
            ['html', 'text', 'watchHtml', 'amp'].forEach(key => {
                if (data[key] && data[key].content) {
                    if (typeof data[key].content === 'string') {
                        data[key] = data[key].content;
                    }
                    else if (Buffer.isBuffer(data[key].content)) {
                        data[key] = data[key].content.toString();
                    }
                }
            });
            if (data.icalEvent && Buffer.isBuffer(data.icalEvent.content)) {
                data.icalEvent.content = data.icalEvent.content.toString('base64');
                data.icalEvent.encoding = 'base64';
            }
            if (data.alternatives && data.alternatives.length) {
                data.alternatives.forEach((alternative) => {
                    if (alternative && alternative.content && Buffer.isBuffer(alternative.content)) {
                        alternative.content = alternative.content.toString('base64');
                        alternative.encoding = 'base64';
                    }
                });
            }
            if (data.attachments && data.attachments.length) {
                data.attachments.forEach((attachment) => {
                    if (attachment && attachment.content && Buffer.isBuffer(attachment.content)) {
                        attachment.content = attachment.content.toString('base64');
                        attachment.encoding = 'base64';
                    }
                });
            }
            data.normalizedHeaders = {};
            Object.keys(data.headers || {}).forEach(key => {
                if (shared.isProtoKey(key)) {
                    return;
                }
                let value = [].concat(data.headers[key] || []).shift();
                value = (value && value.value) || value;
                if (value) {
                    if (['references', 'in-reply-to', 'message-id', 'content-id'].includes(key)) {
                        value = this.message._encodeHeaderValue(key, value);
                    }
                    data.normalizedHeaders[key] = value;
                }
            });
            if (data.list && typeof data.list === 'object') {
                const listHeaders = this._getListHeaders(data.list);
                listHeaders.forEach(entry => {
                    data.normalizedHeaders[entry.key] = entry.value.map(val => (val && val.value) || val).join(', ');
                });
            }
            if (data.references) {
                data.normalizedHeaders.references = this.message._encodeHeaderValue('references', data.references);
            }
            if (data.inReplyTo) {
                data.normalizedHeaders['in-reply-to'] = this.message._encodeHeaderValue('in-reply-to', data.inReplyTo);
            }
            return callback(null, data);
        });
    }
    setMailerHeader() {
        if (!this.message || !this.data.xMailer) {
            return;
        }
        this.message.setHeader('X-Mailer', this.data.xMailer);
    }
    setPriorityHeaders() {
        if (!this.message || !this.data.priority) {
            return;
        }
        switch ((this.data.priority || '').toString().toLowerCase()) {
            case 'high':
                this.message.setHeader('X-Priority', '1 (Highest)');
                this.message.setHeader('X-MSMail-Priority', 'High');
                this.message.setHeader('Importance', 'High');
                break;
            case 'low':
                this.message.setHeader('X-Priority', '5 (Lowest)');
                this.message.setHeader('X-MSMail-Priority', 'Low');
                this.message.setHeader('Importance', 'Low');
                break;
            default:
            // do not add anything, since all messages are 'Normal' by default
        }
    }
    setListHeaders() {
        if (!this.message || !this.data.list || typeof this.data.list !== 'object') {
            return;
        }
        // add optional List-* headers
        this._getListHeaders(this.data.list).forEach(listHeader => {
            listHeader.value.forEach(value => {
                this.message.addHeader(listHeader.key, value);
            });
        });
    }
    _getListHeaders(listData) {
        // make sure an url looks like <protocol:url>
        return Object.keys(listData).map(key => ({
            key: 'list-' + key.toLowerCase().trim(),
            value: [].concat(listData[key] || []).map(value => ({
                prepared: true,
                foldLines: true,
                value: []
                    .concat(value || [])
                    .map(value => {
                    if (typeof value === 'string') {
                        value = {
                            url: value
                        };
                    }
                    if (value && value.url) {
                        // strip CR/LF so a comment can't inject extra header lines. DEL is neither
                        // qtext nor ctext, so it can not be carried literally by either construct
                        // and has to become an encoded word like any other non-plaintext value
                        let comment = (value.comment || '').toString().replace(/\r?\n|\r/g, ' ');
                        const needsEncoding = !mimeFuncs.isPlainText(comment) || /\x7f/.test(comment);
                        if (key.toLowerCase().trim() === 'id') {
                            // List-ID: "comment" <domain>, where an unescaped quote or a trailing
                            // backslash in the comment would swallow the <domain> behind it
                            comment = needsEncoding ? mimeFuncs.encodeWord(comment) : mimeFuncs.quoteString(comment);
                            // List-ID expects a bare domain-like identifier, so strip the
                            // scheme prefix that _formatListUrl adds or passes through
                            return ((value.comment ? comment + ' ' : '') + this._formatListUrl(value.url).replace(/^<[^:]+:\/{0,2}/, '<'));
                        }
                        // List-*: <http://domain> (comment)
                        // the ctext specials go out as quoted-pairs, otherwise a ")" closes the
                        // comment early and leaves the rest as junk, an unpaired "(" opens a
                        // nested comment that never closes, and a trailing backslash escapes
                        // the closing ")" so the comment swallows whatever follows it
                        comment = needsEncoding ? mimeFuncs.encodeWord(comment) : comment.replace(/[()\\]/g, '\\$&');
                        return this._formatListUrl(value.url) + (value.comment ? ' (' + comment + ')' : '');
                    }
                    return '';
                })
                    .filter(value => value)
                    .join(', ')
            }))
        }));
    }
    _formatListUrl(url) {
        // a url has no way to carry a control char or DEL, and the angle brackets around it
        // are not a quoting construct, so anything left here lands in the header raw
        url = url.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '').replace(/[\s<]+|[\s>]+/g, '');
        if (/^(https?|mailto|ftp):/.test(url)) {
            return '<' + url + '>';
        }
        if (/^[^@]+@[^@]+$/.test(url)) {
            return '<mailto:' + url + '>';
        }
        return '<http://' + url + '>';
    }
}
exports["default"] = MailMessage;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 1038:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


/* eslint no-control-regex:0 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isPlainText = isPlainText;
exports.quoteString = quoteString;
exports.hasLongerLines = hasLongerLines;
exports.encodeWord = encodeWord;
exports.encodeWords = encodeWords;
exports.buildHeaderValue = buildHeaderValue;
exports.buildHeaderParam = buildHeaderParam;
exports.parseHeaderValue = parseHeaderValue;
exports.detectExtension = detectExtension;
exports.detectMimeType = detectMimeType;
exports.foldLines = foldLines;
exports.splitMimeEncodedString = splitMimeEncodedString;
exports.encodeURICharComponent = encodeURICharComponent;
exports.safeEncodeURIComponent = safeEncodeURIComponent;
const base64 = __importStar(__nccwpck_require__(4059));
const qp = __importStar(__nccwpck_require__(7529));
const mimeTypes = __importStar(__nccwpck_require__(276));
const objects_js_1 = __nccwpck_require__(6477);
/**
 * Checks if a value is plaintext string (uses only printable 7bit chars)
 *
 * When isParam is set the value is destined for a header parameter, so HT, CR and LF
 * are not plaintext either: a header parameter has no way to carry them. HT is a valid
 * fold point, so folding and unfolding a header would rewrite it as a space, and CR/LF
 * cannot appear in a header value at all. DEL is neither a token character nor qtext,
 * so it can not be carried bare or quoted. Such values have to go through the rfc2231
 * parameter continuation encoding instead, the same way a quote already does.
 *
 * @param value String to be tested
 * @param [isParam] Set to true if the value is a header parameter value
 * @returns true if it is a plaintext string
 */
function isPlainText(value, isParam) {
    const re = isParam ? /[\x00-\x1f\x7f"\u0080-\uFFFF]/ : /[\x00-\x08\x0b\x0c\x0e-\x1f\u0080-\uFFFF]/;
    return typeof value === 'string' && !re.test(value);
}
/**
 * Wraps a value into a quoted-string. Inside one a quote would end the string early
 * and a backslash would escape whatever follows it, so both go out as quoted-pairs.
 *
 * @param value String to be quoted
 * @returns The value as a quoted-string, quotes included
 */
function quoteString(value) {
    return '"' + (value || '').toString().replace(/["\\]/g, '\\$&') + '"';
}
/**
 * Checks if a multi line string containes lines longer than the selected value.
 *
 * Useful when detecting if a mail message needs any processing at all:
 * if only plaintext characters are used and lines are short, then there is
 * no need to encode the values in any way. If the value is plaintext but has
 * longer lines then allowed, then use format=flowed
 *
 * @param lineLength Max line length to check for
 * @returns Returns true if there is at least one line longer than lineLength chars
 */
function hasLongerLines(str, lineLength) {
    if (str.length > 128 * 1024) {
        // do not test strings longer than 128kB
        return true;
    }
    return new RegExp('^.{' + (lineLength + 1) + ',}', 'm').test(str);
}
/**
 * Encodes a string or an Buffer to an UTF-8 MIME Word (rfc2047)
 *
 * @param data String to be encoded
 * @param mimeWordEncoding='Q' Encoding for the mime word, either Q or B
 * @param [maxLength=0] If set, split mime words into several chunks if needed
 * @return Single or several mime words joined together
 */
function encodeWord(data, mimeWordEncoding, maxLength) {
    mimeWordEncoding = (mimeWordEncoding || 'Q').toString().toUpperCase().trim().charAt(0);
    maxLength = maxLength || 0;
    let encodedStr;
    const toCharset = 'UTF-8';
    if (maxLength && maxLength > 7 + toCharset.length) {
        maxLength -= 7 + toCharset.length;
    }
    if (mimeWordEncoding === 'Q') {
        // https://tools.ietf.org/html/rfc2047#section-5 rule (3)
        encodedStr = qp.encode(data).replace(/[^a-z0-9!*+\-/=]/gi, chr => {
            const ord = chr.charCodeAt(0).toString(16).toUpperCase();
            if (chr === ' ') {
                return '_';
            }
            return '=' + (ord.length === 1 ? '0' + ord : ord);
        });
    }
    else if (mimeWordEncoding === 'B') {
        encodedStr = typeof data === 'string' ? data : base64.encode(data);
        maxLength = maxLength ? Math.max(3, ((maxLength - (maxLength % 4)) / 4) * 3) : 0;
    }
    if (maxLength && (mimeWordEncoding !== 'B' ? encodedStr : base64.encode(data)).length > maxLength) {
        if (mimeWordEncoding === 'Q') {
            encodedStr = splitMimeEncodedString(encodedStr, maxLength).join('?= =?' + toCharset + '?' + mimeWordEncoding + '?');
        }
        else {
            // RFC2047 6.3 (2) states that encoded-word must include an integral number of characters, so no chopping unicode sequences
            const parts = [];
            let lpart = '';
            for (let i = 0, len = encodedStr.length; i < len; i++) {
                let chr = encodedStr.charAt(i);
                if (/[\ud800-\udbff]/.test(chr) && /[\udc00-\udfff]/.test(encodedStr.charAt(i + 1))) {
                    // leading surrogate, so add the trailing surrogate as well
                    // an unpaired one must not swallow the next unit, that would destroy
                    // a valid pair following it
                    chr += encodedStr.charAt(++i);
                }
                // check if we can add this character to the existing string
                // without breaking byte length limit
                if (Buffer.byteLength(lpart + chr) <= maxLength || i === 0) {
                    lpart += chr;
                }
                else {
                    // we hit the length limit, so push the existing string and start over
                    parts.push(base64.encode(lpart));
                    lpart = chr;
                }
            }
            if (lpart) {
                parts.push(base64.encode(lpart));
            }
            if (parts.length > 1) {
                encodedStr = parts.join('?= =?' + toCharset + '?' + mimeWordEncoding + '?');
            }
            else {
                encodedStr = parts.join('');
            }
        }
    }
    else if (mimeWordEncoding === 'B') {
        encodedStr = base64.encode(data);
    }
    return '=?' + toCharset + '?' + mimeWordEncoding + '?' + encodedStr + (encodedStr.substr(-2) === '?=' ? '' : '?=');
}
/**
 * Finds word sequences with non ascii text and converts these to mime words
 *
 * @param value String to be encoded
 * @param mimeWordEncoding='Q' Encoding for the mime word, either Q or B
 * @param [maxLength=0] If set, split mime words into several chunks if needed
 * @param [encodeAll=false] If true and the value needs encoding then encodes entire string, not just the smallest match
 * @return String with possible mime words
 */
function encodeWords(value, mimeWordEncoding, maxLength, encodeAll) {
    maxLength = maxLength || 0;
    // find first word with a non-printable ascii or special symbol in it
    const firstMatch = value.match(/(?:^|\s)([^\s]*["\u0080-\uFFFF])/);
    if (!firstMatch) {
        return value;
    }
    if (encodeAll) {
        // if it is requested to encode everything or the string contains something that resebles encoded word, then encode everything
        return encodeWord(value, mimeWordEncoding, maxLength);
    }
    // find the last word with a non-printable ascii in it
    const lastMatch = value.match(/(["\u0080-\uFFFF][^\s]*)[^"\u0080-\uFFFF]*$/);
    if (!lastMatch) {
        // should not happen
        return value;
    }
    const startIndex = firstMatch.index +
        (firstMatch[0].match(/[^\s]/) || {
            index: 0
        }).index;
    const endIndex = lastMatch.index + (lastMatch[1] || '').length;
    return ((startIndex ? value.substr(0, startIndex) : '') +
        encodeWord(value.substring(startIndex, endIndex), mimeWordEncoding || 'Q', maxLength) +
        (endIndex < value.length ? value.substr(endIndex) : ''));
}
/**
 * Joins parsed header value together as 'value; param1=value1; param2=value2'
 * PS: We are following RFC 822 for the list of special characters that we need to keep in quotes.
 *      Refer: https://www.w3.org/Protocols/rfc1341/4_Content-Type.html
 * @param structured Parsed header value
 * @return joined header value
 */
function buildHeaderValue(structured) {
    const paramsArray = [];
    Object.keys(structured.params || {}).forEach(key => {
        // filename might include unicode characters so it is a special case
        // other values probably do not
        const value = structured.params[key];
        // a parameter name is a token too and it is emitted without any quoting around it
        const param = key.replace(/[\x00-\x1f\x7f]/g, '');
        if (!isPlainText(value, true) || value.length >= 75) {
            buildHeaderParam(param, value, 50).forEach(encodedParam => {
                if (!/[\s"\\;:/=(),<>@[\]?]|^[-']|'$/.test(encodedParam.value) || encodedParam.key.substr(-1) === '*') {
                    paramsArray.push(encodedParam.key + '=' + encodedParam.value);
                }
                else {
                    paramsArray.push(encodedParam.key + '=' + JSON.stringify(encodedParam.value));
                }
            });
        }
        else if (/[\s'"\\;:/=(),<>@[\]?]|^-/.test(value)) {
            paramsArray.push(param + '=' + JSON.stringify(value));
        }
        else {
            paramsArray.push(param + '=' + value);
        }
    });
    // the value ahead of the parameters is a token, it has no way to carry a control
    // char or DEL and there is no quoting construct around it to escape one into
    const value = typeof structured.value === 'string' ? structured.value.replace(/[\x00-\x1f\x7f]/g, '') : structured.value;
    return value + (paramsArray.length ? '; ' + paramsArray.join('; ') : '');
}
/**
 * Encodes a string or an Buffer to an UTF-8 Parameter Value Continuation encoding (rfc2231)
 * Useful for splitting long parameter values.
 *
 * For example
 *      title="unicode string"
 * becomes
 *     title*0*=utf-8''unicode
 *     title*1*=%20string
 *
 * @param data String to be encoded
 * @param [maxLength=50] Max length for generated chunks
 * @param [fromCharset='UTF-8'] Source sharacter set
 * @return A list of encoded keys and headers
 */
function buildHeaderParam(key, data, maxLength) {
    const list = [];
    let encodedStr = typeof data === 'string' ? data : (data || '').toString();
    let chr;
    let line;
    let startPos = 0;
    let i, len;
    maxLength = maxLength || 50;
    // process ascii only text
    if (isPlainText(data, true)) {
        // check if conversion is even needed
        if (encodedStr.length <= maxLength) {
            return [
                {
                    key,
                    value: encodedStr
                }
            ];
        }
        encodedStr = encodedStr.replace(new RegExp('.{' + maxLength + '}', 'g'), str => {
            list.push({
                line: str
            });
            return '';
        });
        if (encodedStr) {
            list.push({
                line: encodedStr
            });
        }
    }
    else {
        if (/[\uD800-\uDBFF]/.test(encodedStr)) {
            // string containts surrogate pairs, so normalize it to an array of bytes
            const encodedStrArr = [];
            for (i = 0, len = encodedStr.length; i < len; i++) {
                chr = encodedStr.charAt(i);
                if (/[\ud800-\udbff]/.test(chr) && /[\udc00-\udfff]/.test(encodedStr.charAt(i + 1))) {
                    // an unpaired leading surrogate must not consume the next unit, that
                    // would tear apart a valid pair following it
                    chr += encodedStr.charAt(i + 1);
                    encodedStrArr.push(chr);
                    i++;
                }
                else {
                    encodedStrArr.push(chr);
                }
            }
            encodedStr = encodedStrArr;
        }
        // first line includes the charset and language info and needs to be encoded
        // even if it does not contain any unicode characters
        line = "utf-8''";
        let encoded = true;
        startPos = 0;
        // process text with unicode or special chars
        for (i = 0, len = encodedStr.length; i < len; i++) {
            chr = encodedStr[i];
            if (encoded) {
                chr = safeEncodeURIComponent(chr);
            }
            else {
                // try to urlencode current char
                chr = chr === ' ' ? chr : safeEncodeURIComponent(chr);
                // By default it is not required to encode a line, the need
                // only appears when the string contains unicode or special chars
                // in this case we start processing the line over and encode all chars
                if (chr !== encodedStr[i]) {
                    // Check if it is even possible to add the encoded char to the line
                    // If not, there is no reason to use this line, just push it to the list
                    // and start a new line with the char that needs encoding
                    if ((safeEncodeURIComponent(line) + chr).length >= maxLength) {
                        list.push({
                            line,
                            encoded
                        });
                        // the line we start here holds an encoded char, so it has to be
                        // flagged as one. otherwise it gets an unstarred continuation key
                        // and a receiver reads the percent escapes as literal text
                        line = '';
                        encoded = true;
                    }
                    else {
                        encoded = true;
                        i = startPos;
                        line = '';
                        continue;
                    }
                }
            }
            // if the line is already too long, push it to the list and start a new one
            if ((line + chr).length >= maxLength) {
                list.push({
                    line,
                    encoded
                });
                line = chr = encodedStr[i] === ' ' ? ' ' : safeEncodeURIComponent(encodedStr[i]);
                if (chr === encodedStr[i]) {
                    encoded = false;
                    startPos = i - 1;
                }
                else {
                    encoded = true;
                }
            }
            else {
                line += chr;
            }
        }
        if (line) {
            list.push({
                line,
                encoded
            });
        }
    }
    return list.map((item, i) => ({
        // encoded lines: {name}*{part}*
        // unencoded lines: {name}*{part}
        // if any line needs to be encoded then the first line (part==0) is always encoded
        key: key + '*' + i + (item.encoded ? '*' : ''),
        value: item.line
    }));
}
/**
 * Parses a header value with key=value arguments into a structured
 * object.
 *
 *   parseHeaderValue('content-type: text/plain; CHARSET='UTF-8'') ->
 *   {
 *     'value': 'text/plain',
 *     'params': {
 *       'charset': 'UTF-8'
 *     }
 *   }
 *
 * @param str Header value
 * @return Header value as a parsed structure
 */
function parseHeaderValue(str) {
    const response = {
        value: false,
        params: {}
    };
    // Parameter names come from a caller supplied contentType/contentDisposition. A
    // "__proto__" name would target the prototype chain of the params object instead of
    // an own property of it, and read back as Object.prototype, so it is dropped.
    const setParam = (name, value) => {
        if (!(0, objects_js_1.isProtoKey)(name)) {
            response.params[name] = value;
        }
    };
    let key = false;
    let value = '';
    let type = 'value';
    let quote = false;
    let escaped = false;
    let chr;
    for (let i = 0, len = str.length; i < len; i++) {
        chr = str.charAt(i);
        if (type === 'key') {
            if (chr === '=') {
                key = value.trim().toLowerCase();
                type = 'value';
                value = '';
                continue;
            }
            value += chr;
        }
        else {
            if (escaped) {
                value += chr;
            }
            else if (chr === '\\') {
                escaped = true;
                continue;
            }
            else if (quote && chr === quote) {
                quote = false;
            }
            else if (!quote && chr === '"') {
                quote = chr;
            }
            else if (!quote && chr === ';') {
                if (key === false) {
                    response.value = value.trim();
                }
                else {
                    setParam(key, value.trim());
                }
                type = 'key';
                value = '';
            }
            else {
                value += chr;
            }
            escaped = false;
        }
    }
    if (type === 'value') {
        if (key === false) {
            response.value = value.trim();
        }
        else {
            setParam(key, value.trim());
        }
    }
    else if (value.trim()) {
        setParam(value.trim().toLowerCase(), '');
    }
    // handle parameter value continuations
    // https://tools.ietf.org/html/rfc2231#section-3
    // preprocess values
    Object.keys(response.params).forEach(key => {
        let actualKey, nr, match, value;
        if ((match = key.match(/(\*(\d+)|\*(\d+)\*|\*)$/))) {
            actualKey = key.substr(0, match.index);
            nr = Number(match[2] || match[3]) || 0;
            if ((0, objects_js_1.isProtoKey)(actualKey)) {
                // see setParam. Reading it back would yield Object.prototype, which is
                // an object, so the initializer below would be skipped and the write
                // that follows would throw out of a header build the caller can not catch
                delete response.params[key];
                return;
            }
            if (!response.params[actualKey] || typeof response.params[actualKey] !== 'object') {
                response.params[actualKey] = {
                    charset: false,
                    values: []
                };
            }
            value = response.params[key];
            if (nr === 0 && match[0].substr(-1) === '*' && (match = value.match(/^([^']*)'[^']*'(.*)$/))) {
                response.params[actualKey].charset = match[1] || 'iso-8859-1';
                value = match[2];
            }
            response.params[actualKey].values[nr] = value;
            // remove the old reference
            delete response.params[key];
        }
    });
    // concatenate split rfc2231 strings and convert encoded strings to mime encoded words
    Object.keys(response.params).forEach(key => {
        let value;
        if (response.params[key] && Array.isArray(response.params[key].values)) {
            value = response.params[key].values.map((val) => val || '').join('');
            if (response.params[key].charset) {
                // convert "%AB" to "=?charset?Q?=AB?="
                response.params[key] =
                    '=?' +
                        response.params[key].charset +
                        '?Q?' +
                        value
                            // fix invalidly encoded chars
                            .replace(/[=?_\s]/g, s => {
                            const c = s.charCodeAt(0).toString(16);
                            if (s === ' ') {
                                return '_';
                            }
                            return '%' + (c.length < 2 ? '0' : '') + c;
                        })
                            // change from urlencoding to percent encoding
                            .replace(/%/g, '=') +
                        '?=';
            }
            else {
                response.params[key] = value;
            }
        }
    });
    return response;
}
/**
 * Returns file extension for a content type string. If no suitable extensions
 * are found, 'bin' is used as the default extension
 *
 * @param mimeType Content type to be checked for
 * @return File extension
 */
function detectExtension(mimeType) {
    return mimeTypes.detectExtension(mimeType);
}
/**
 * Returns content type for a file extension. If no suitable content types
 * are found, 'application/octet-stream' is used as the default content type
 *
 * @param extension Extension to be checked for
 * @return File extension
 */
function detectMimeType(extension) {
    return mimeTypes.detectMimeType(extension);
}
/**
 * Folds long lines, useful for folding header lines (afterSpace=false) and
 * flowed text (afterSpace=true)
 *
 * @param str String to be folded
 * @param [lineLength=76] Maximum length of a line
 * @param afterSpace If true, leave a space in th end of a line
 * @return String with folded lines
 */
function foldLines(str, lineLength, afterSpace) {
    str = (str || '').toString();
    lineLength = lineLength || 76;
    let pos = 0;
    const len = str.length;
    let result = '';
    let line, match;
    while (pos < len) {
        line = str.substr(pos, lineLength);
        if (line.length < lineLength) {
            result += line;
            break;
        }
        if ((match = line.match(/^[^\n\r]*(\r?\n|\r)/))) {
            line = match[0];
            result += line;
            pos += line.length;
            continue;
        }
        else if ((match = line.match(/(\s+)[^\s]*$/)) && match[0].length - (afterSpace ? (match[1] || '').length : 0) < line.length) {
            line = line.substr(0, line.length - (match[0].length - (afterSpace ? (match[1] || '').length : 0)));
        }
        else if ((match = str.substr(pos + line.length).match(/^[^\s]+(\s*)/))) {
            line = line + match[0].substr(0, match[0].length - (!afterSpace ? (match[1] || '').length : 0));
        }
        result += line;
        pos += line.length;
        if (pos < len) {
            result += '\r\n';
        }
    }
    return result;
}
/**
 * Splits a mime encoded string. Needed for dividing mime words into smaller chunks
 *
 * @param str Mime encoded string to be split up
 * @param maxlen Maximum length of characters for one part (minimum 12)
 * @return Split string
 */
function splitMimeEncodedString(str, maxlen) {
    const lines = [];
    let curLine, fallbackLine, match, chr, done;
    // require at least 12 symbols to fit possible 4 octet UTF-8 sequences
    maxlen = Math.max(maxlen || 0, 12);
    while (str.length) {
        curLine = str.substr(0, maxlen);
        // move incomplete escaped char back to main
        if ((match = curLine.match(/[=][0-9A-F]?$/i))) {
            curLine = curLine.substr(0, match.index);
        }
        // Malformed input (a run of stray UTF-8 continuation bytes) has no split point
        // that keeps a character sequence whole, so the loop below walks back to an
        // empty line looking for one. Keep the widest chunk that at least does not cut
        // a "=XX" escape in half, so the part stays a decodable encoded word.
        fallbackLine = curLine.length ? curLine : str.substr(0, maxlen);
        done = false;
        while (!done && curLine.length) {
            done = true;
            // check if not middle of a unicode char sequence
            if ((match = str.substr(curLine.length).match(/^[=]([0-9A-F]{2})/i))) {
                chr = parseInt(match[1], 16);
                // invalid sequence, move one char back anc recheck
                if (chr < 0xc2 && chr > 0x7f) {
                    curLine = curLine.substr(0, curLine.length - 3);
                    done = false;
                }
            }
        }
        if (!curLine.length) {
            curLine = fallbackLine;
        }
        lines.push(curLine);
        str = str.substr(curLine.length);
    }
    return lines;
}
function encodeURICharComponent(chr) {
    let res = '';
    let ord = chr.charCodeAt(0).toString(16).toUpperCase();
    if (ord.length % 2) {
        ord = '0' + ord;
    }
    if (ord.length > 2) {
        for (let i = 0, len = ord.length / 2; i < len; i++) {
            res += '%' + ord.substr(i, 2);
        }
    }
    else {
        res += '%' + ord;
    }
    return res;
}
function safeEncodeURIComponent(str) {
    str = (str || '').toString();
    try {
        // might throw if we try to encode invalid sequences, eg. partial emoji
        str = encodeURIComponent(str);
    }
    catch (_E) {
        // an unpaired surrogate has no utf-8 representation, so run the value through a
        // utf-8 roundtrip to get the same U+FFFD every other encoder here produces and
        // retry. the value must never come back unencoded, it goes into a header parameter
        // where a bare quote or semicolon would break it out into a parameter of its own
        str = encodeURIComponent(Buffer.from(str, 'utf-8').toString('utf-8'));
    }
    // ensure chars that are not handled by encodeURICompent are converted as well
    return str.replace(/[\x00-\x1F *'()<>@,;:\\"[\]?=\u007F-\uFFFF]/g, chr => encodeURICharComponent(chr));
}


/***/ }),

/***/ 276:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


/* eslint quote-props: 0 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.detectMimeType = detectMimeType;
exports.detectExtension = detectExtension;
const node_path_1 = __importDefault(__nccwpck_require__(6760));
const defaultMimeType = 'application/octet-stream';
const defaultExtension = 'bin';
const mimeTypes = new Map([
    ['application/acad', 'dwg'],
    ['application/applixware', 'aw'],
    ['application/arj', 'arj'],
    ['application/atom+xml', 'xml'],
    ['application/atomcat+xml', 'atomcat'],
    ['application/atomsvc+xml', 'atomsvc'],
    ['application/base64', ['mm', 'mme']],
    ['application/binhex', 'hqx'],
    ['application/binhex4', 'hqx'],
    ['application/book', ['book', 'boo']],
    ['application/ccxml+xml,', 'ccxml'],
    ['application/cdf', 'cdf'],
    ['application/cdmi-capability', 'cdmia'],
    ['application/cdmi-container', 'cdmic'],
    ['application/cdmi-domain', 'cdmid'],
    ['application/cdmi-object', 'cdmio'],
    ['application/cdmi-queue', 'cdmiq'],
    ['application/clariscad', 'ccad'],
    ['application/commonground', 'dp'],
    ['application/cu-seeme', 'cu'],
    ['application/davmount+xml', 'davmount'],
    ['application/drafting', 'drw'],
    ['application/dsptype', 'tsp'],
    ['application/dssc+der', 'dssc'],
    ['application/dssc+xml', 'xdssc'],
    ['application/dxf', 'dxf'],
    ['application/ecmascript', ['js', 'es']],
    ['application/emma+xml', 'emma'],
    ['application/envoy', 'evy'],
    ['application/epub+zip', 'epub'],
    ['application/excel', ['xls', 'xl', 'xla', 'xlb', 'xlc', 'xld', 'xlk', 'xll', 'xlm', 'xlt', 'xlv', 'xlw']],
    ['application/exi', 'exi'],
    ['application/font-tdpfr', 'pfr'],
    ['application/fractals', 'fif'],
    ['application/freeloader', 'frl'],
    ['application/futuresplash', 'spl'],
    ['application/geo+json', 'geojson'],
    ['application/gnutar', 'tgz'],
    ['application/groupwise', 'vew'],
    ['application/hlp', 'hlp'],
    ['application/hta', 'hta'],
    ['application/hyperstudio', 'stk'],
    ['application/i-deas', 'unv'],
    ['application/iges', ['iges', 'igs']],
    ['application/inf', 'inf'],
    ['application/internet-property-stream', 'acx'],
    ['application/ipfix', 'ipfix'],
    ['application/java', 'class'],
    ['application/java-archive', 'jar'],
    ['application/java-byte-code', 'class'],
    ['application/java-serialized-object', 'ser'],
    ['application/java-vm', 'class'],
    ['application/javascript', 'js'],
    ['application/json', 'json'],
    ['application/lha', 'lha'],
    ['application/lzx', 'lzx'],
    ['application/mac-binary', 'bin'],
    ['application/mac-binhex', 'hqx'],
    ['application/mac-binhex40', 'hqx'],
    ['application/mac-compactpro', 'cpt'],
    ['application/macbinary', 'bin'],
    ['application/mads+xml', 'mads'],
    ['application/marc', 'mrc'],
    ['application/marcxml+xml', 'mrcx'],
    ['application/mathematica', 'ma'],
    ['application/mathml+xml', 'mathml'],
    ['application/mbedlet', 'mbd'],
    ['application/mbox', 'mbox'],
    ['application/mcad', 'mcd'],
    ['application/mediaservercontrol+xml', 'mscml'],
    ['application/metalink4+xml', 'meta4'],
    ['application/mets+xml', 'mets'],
    ['application/mime', 'aps'],
    ['application/mods+xml', 'mods'],
    ['application/mp21', 'm21'],
    ['application/mp4', 'mp4'],
    ['application/mspowerpoint', ['ppt', 'pot', 'pps', 'ppz']],
    ['application/msword', ['doc', 'dot', 'w6w', 'wiz', 'word']],
    ['application/mswrite', 'wri'],
    ['application/mxf', 'mxf'],
    ['application/netmc', 'mcp'],
    ['application/octet-stream', ['*']],
    ['application/oda', 'oda'],
    ['application/oebps-package+xml', 'opf'],
    ['application/ogg', 'ogx'],
    ['application/olescript', 'axs'],
    ['application/onenote', 'onetoc'],
    ['application/patch-ops-error+xml', 'xer'],
    ['application/pdf', 'pdf'],
    ['application/pgp-encrypted', 'asc'],
    ['application/pgp-signature', 'pgp'],
    ['application/pics-rules', 'prf'],
    ['application/pkcs-12', 'p12'],
    ['application/pkcs-crl', 'crl'],
    ['application/pkcs10', 'p10'],
    ['application/pkcs7-mime', ['p7c', 'p7m']],
    ['application/pkcs7-signature', 'p7s'],
    ['application/pkcs8', 'p8'],
    ['application/pkix-attr-cert', 'ac'],
    ['application/pkix-cert', ['cer', 'crt']],
    ['application/pkix-crl', 'crl'],
    ['application/pkix-pkipath', 'pkipath'],
    ['application/pkixcmp', 'pki'],
    ['application/plain', 'text'],
    ['application/pls+xml', 'pls'],
    ['application/postscript', ['ps', 'ai', 'eps']],
    ['application/powerpoint', 'ppt'],
    ['application/pro_eng', ['part', 'prt']],
    ['application/prs.cww', 'cww'],
    ['application/pskc+xml', 'pskcxml'],
    ['application/rdf+xml', 'rdf'],
    ['application/reginfo+xml', 'rif'],
    ['application/relax-ng-compact-syntax', 'rnc'],
    ['application/resource-lists+xml', 'rl'],
    ['application/resource-lists-diff+xml', 'rld'],
    ['application/ringing-tones', 'rng'],
    ['application/rls-services+xml', 'rs'],
    ['application/rsd+xml', 'rsd'],
    ['application/rss+xml', 'xml'],
    ['application/rtf', ['rtf', 'rtx']],
    ['application/sbml+xml', 'sbml'],
    ['application/scvp-cv-request', 'scq'],
    ['application/scvp-cv-response', 'scs'],
    ['application/scvp-vp-request', 'spq'],
    ['application/scvp-vp-response', 'spp'],
    ['application/sdp', 'sdp'],
    ['application/sea', 'sea'],
    ['application/set', 'set'],
    ['application/set-payment-initiation', 'setpay'],
    ['application/set-registration-initiation', 'setreg'],
    ['application/shf+xml', 'shf'],
    ['application/sla', 'stl'],
    ['application/smil', ['smi', 'smil']],
    ['application/smil+xml', 'smi'],
    ['application/solids', 'sol'],
    ['application/sounder', 'sdr'],
    ['application/sparql-query', 'rq'],
    ['application/sparql-results+xml', 'srx'],
    ['application/srgs', 'gram'],
    ['application/srgs+xml', 'grxml'],
    ['application/sru+xml', 'sru'],
    ['application/ssml+xml', 'ssml'],
    ['application/step', ['step', 'stp']],
    ['application/streamingmedia', 'ssm'],
    ['application/tei+xml', 'tei'],
    ['application/thraud+xml', 'tfi'],
    ['application/timestamped-data', 'tsd'],
    ['application/toolbook', 'tbk'],
    ['application/vda', 'vda'],
    ['application/vnd.3gpp.pic-bw-large', 'plb'],
    ['application/vnd.3gpp.pic-bw-small', 'psb'],
    ['application/vnd.3gpp.pic-bw-var', 'pvb'],
    ['application/vnd.3gpp2.tcap', 'tcap'],
    ['application/vnd.3m.post-it-notes', 'pwn'],
    ['application/vnd.accpac.simply.aso', 'aso'],
    ['application/vnd.accpac.simply.imp', 'imp'],
    ['application/vnd.acucobol', 'acu'],
    ['application/vnd.acucorp', 'atc'],
    ['application/vnd.adobe.air-application-installer-package+zip', 'air'],
    ['application/vnd.adobe.fxp', 'fxp'],
    ['application/vnd.adobe.xdp+xml', 'xdp'],
    ['application/vnd.adobe.xfdf', 'xfdf'],
    ['application/vnd.ahead.space', 'ahead'],
    ['application/vnd.airzip.filesecure.azf', 'azf'],
    ['application/vnd.airzip.filesecure.azs', 'azs'],
    ['application/vnd.amazon.ebook', 'azw'],
    ['application/vnd.americandynamics.acc', 'acc'],
    ['application/vnd.amiga.ami', 'ami'],
    ['application/vnd.android.package-archive', 'apk'],
    ['application/vnd.anser-web-certificate-issue-initiation', 'cii'],
    ['application/vnd.anser-web-funds-transfer-initiation', 'fti'],
    ['application/vnd.antix.game-component', 'atx'],
    ['application/vnd.apple.installer+xml', 'mpkg'],
    ['application/vnd.apple.mpegurl', 'm3u8'],
    ['application/vnd.aristanetworks.swi', 'swi'],
    ['application/vnd.audiograph', 'aep'],
    ['application/vnd.blueice.multipass', 'mpm'],
    ['application/vnd.bmi', 'bmi'],
    ['application/vnd.businessobjects', 'rep'],
    ['application/vnd.chemdraw+xml', 'cdxml'],
    ['application/vnd.chipnuts.karaoke-mmd', 'mmd'],
    ['application/vnd.cinderella', 'cdy'],
    ['application/vnd.claymore', 'cla'],
    ['application/vnd.cloanto.rp9', 'rp9'],
    ['application/vnd.clonk.c4group', 'c4g'],
    ['application/vnd.cluetrust.cartomobile-config', 'c11amc'],
    ['application/vnd.cluetrust.cartomobile-config-pkg', 'c11amz'],
    ['application/vnd.commonspace', 'csp'],
    ['application/vnd.contact.cmsg', 'cdbcmsg'],
    ['application/vnd.cosmocaller', 'cmc'],
    ['application/vnd.crick.clicker', 'clkx'],
    ['application/vnd.crick.clicker.keyboard', 'clkk'],
    ['application/vnd.crick.clicker.palette', 'clkp'],
    ['application/vnd.crick.clicker.template', 'clkt'],
    ['application/vnd.crick.clicker.wordbank', 'clkw'],
    ['application/vnd.criticaltools.wbs+xml', 'wbs'],
    ['application/vnd.ctc-posml', 'pml'],
    ['application/vnd.cups-ppd', 'ppd'],
    ['application/vnd.curl.car', 'car'],
    ['application/vnd.curl.pcurl', 'pcurl'],
    ['application/vnd.data-vision.rdz', 'rdz'],
    ['application/vnd.denovo.fcselayout-link', 'fe_launch'],
    ['application/vnd.dna', 'dna'],
    ['application/vnd.dolby.mlp', 'mlp'],
    ['application/vnd.dpgraph', 'dpg'],
    ['application/vnd.dreamfactory', 'dfac'],
    ['application/vnd.dvb.ait', 'ait'],
    ['application/vnd.dvb.service', 'svc'],
    ['application/vnd.dynageo', 'geo'],
    ['application/vnd.ecowin.chart', 'mag'],
    ['application/vnd.enliven', 'nml'],
    ['application/vnd.epson.esf', 'esf'],
    ['application/vnd.epson.msf', 'msf'],
    ['application/vnd.epson.quickanime', 'qam'],
    ['application/vnd.epson.salt', 'slt'],
    ['application/vnd.epson.ssf', 'ssf'],
    ['application/vnd.eszigno3+xml', 'es3'],
    ['application/vnd.ezpix-album', 'ez2'],
    ['application/vnd.ezpix-package', 'ez3'],
    ['application/vnd.fdf', 'fdf'],
    ['application/vnd.fdsn.seed', 'seed'],
    ['application/vnd.flographit', 'gph'],
    ['application/vnd.fluxtime.clip', 'ftc'],
    ['application/vnd.framemaker', 'fm'],
    ['application/vnd.frogans.fnc', 'fnc'],
    ['application/vnd.frogans.ltf', 'ltf'],
    ['application/vnd.fsc.weblaunch', 'fsc'],
    ['application/vnd.fujitsu.oasys', 'oas'],
    ['application/vnd.fujitsu.oasys2', 'oa2'],
    ['application/vnd.fujitsu.oasys3', 'oa3'],
    ['application/vnd.fujitsu.oasysgp', 'fg5'],
    ['application/vnd.fujitsu.oasysprs', 'bh2'],
    ['application/vnd.fujixerox.ddd', 'ddd'],
    ['application/vnd.fujixerox.docuworks', 'xdw'],
    ['application/vnd.fujixerox.docuworks.binder', 'xbd'],
    ['application/vnd.fuzzysheet', 'fzs'],
    ['application/vnd.genomatix.tuxedo', 'txd'],
    ['application/vnd.geogebra.file', 'ggb'],
    ['application/vnd.geogebra.tool', 'ggt'],
    ['application/vnd.geometry-explorer', 'gex'],
    ['application/vnd.geonext', 'gxt'],
    ['application/vnd.geoplan', 'g2w'],
    ['application/vnd.geospace', 'g3w'],
    ['application/vnd.gmx', 'gmx'],
    ['application/vnd.google-earth.kml+xml', 'kml'],
    ['application/vnd.google-earth.kmz', 'kmz'],
    ['application/vnd.grafeq', 'gqf'],
    ['application/vnd.groove-account', 'gac'],
    ['application/vnd.groove-help', 'ghf'],
    ['application/vnd.groove-identity-message', 'gim'],
    ['application/vnd.groove-injector', 'grv'],
    ['application/vnd.groove-tool-message', 'gtm'],
    ['application/vnd.groove-tool-template', 'tpl'],
    ['application/vnd.groove-vcard', 'vcg'],
    ['application/vnd.hal+xml', 'hal'],
    ['application/vnd.handheld-entertainment+xml', 'zmm'],
    ['application/vnd.hbci', 'hbci'],
    ['application/vnd.hhe.lesson-player', 'les'],
    ['application/vnd.hp-hpgl', ['hgl', 'hpg', 'hpgl']],
    ['application/vnd.hp-hpid', 'hpid'],
    ['application/vnd.hp-hps', 'hps'],
    ['application/vnd.hp-jlyt', 'jlt'],
    ['application/vnd.hp-pcl', 'pcl'],
    ['application/vnd.hp-pclxl', 'pclxl'],
    ['application/vnd.hydrostatix.sof-data', 'sfd-hdstx'],
    ['application/vnd.hzn-3d-crossword', 'x3d'],
    ['application/vnd.ibm.minipay', 'mpy'],
    ['application/vnd.ibm.modcap', 'afp'],
    ['application/vnd.ibm.rights-management', 'irm'],
    ['application/vnd.ibm.secure-container', 'sc'],
    ['application/vnd.iccprofile', 'icc'],
    ['application/vnd.igloader', 'igl'],
    ['application/vnd.immervision-ivp', 'ivp'],
    ['application/vnd.immervision-ivu', 'ivu'],
    ['application/vnd.insors.igm', 'igm'],
    ['application/vnd.intercon.formnet', 'xpw'],
    ['application/vnd.intergeo', 'i2g'],
    ['application/vnd.intu.qbo', 'qbo'],
    ['application/vnd.intu.qfx', 'qfx'],
    ['application/vnd.ipunplugged.rcprofile', 'rcprofile'],
    ['application/vnd.irepository.package+xml', 'irp'],
    ['application/vnd.is-xpr', 'xpr'],
    ['application/vnd.isac.fcs', 'fcs'],
    ['application/vnd.jam', 'jam'],
    ['application/vnd.jcp.javame.midlet-rms', 'rms'],
    ['application/vnd.jisp', 'jisp'],
    ['application/vnd.joost.joda-archive', 'joda'],
    ['application/vnd.kahootz', 'ktz'],
    ['application/vnd.kde.karbon', 'karbon'],
    ['application/vnd.kde.kchart', 'chrt'],
    ['application/vnd.kde.kformula', 'kfo'],
    ['application/vnd.kde.kivio', 'flw'],
    ['application/vnd.kde.kontour', 'kon'],
    ['application/vnd.kde.kpresenter', 'kpr'],
    ['application/vnd.kde.kspread', 'ksp'],
    ['application/vnd.kde.kword', 'kwd'],
    ['application/vnd.kenameaapp', 'htke'],
    ['application/vnd.kidspiration', 'kia'],
    ['application/vnd.kinar', 'kne'],
    ['application/vnd.koan', 'skp'],
    ['application/vnd.kodak-descriptor', 'sse'],
    ['application/vnd.las.las+xml', 'lasxml'],
    ['application/vnd.llamagraphics.life-balance.desktop', 'lbd'],
    ['application/vnd.llamagraphics.life-balance.exchange+xml', 'lbe'],
    ['application/vnd.lotus-1-2-3', '123'],
    ['application/vnd.lotus-approach', 'apr'],
    ['application/vnd.lotus-freelance', 'pre'],
    ['application/vnd.lotus-notes', 'nsf'],
    ['application/vnd.lotus-organizer', 'org'],
    ['application/vnd.lotus-screencam', 'scm'],
    ['application/vnd.lotus-wordpro', 'lwp'],
    ['application/vnd.macports.portpkg', 'portpkg'],
    ['application/vnd.mcd', 'mcd'],
    ['application/vnd.medcalcdata', 'mc1'],
    ['application/vnd.mediastation.cdkey', 'cdkey'],
    ['application/vnd.mfer', 'mwf'],
    ['application/vnd.mfmp', 'mfm'],
    ['application/vnd.micrografx.flo', 'flo'],
    ['application/vnd.micrografx.igx', 'igx'],
    ['application/vnd.mif', 'mif'],
    ['application/vnd.mobius.daf', 'daf'],
    ['application/vnd.mobius.dis', 'dis'],
    ['application/vnd.mobius.mbk', 'mbk'],
    ['application/vnd.mobius.mqy', 'mqy'],
    ['application/vnd.mobius.msl', 'msl'],
    ['application/vnd.mobius.plc', 'plc'],
    ['application/vnd.mobius.txf', 'txf'],
    ['application/vnd.mophun.application', 'mpn'],
    ['application/vnd.mophun.certificate', 'mpc'],
    ['application/vnd.mozilla.xul+xml', 'xul'],
    ['application/vnd.ms-artgalry', 'cil'],
    ['application/vnd.ms-cab-compressed', 'cab'],
    ['application/vnd.ms-excel', ['xls', 'xla', 'xlc', 'xlm', 'xlt', 'xlw', 'xlb', 'xll']],
    ['application/vnd.ms-excel.addin.macroenabled.12', 'xlam'],
    ['application/vnd.ms-excel.sheet.binary.macroenabled.12', 'xlsb'],
    ['application/vnd.ms-excel.sheet.macroenabled.12', 'xlsm'],
    ['application/vnd.ms-excel.template.macroenabled.12', 'xltm'],
    ['application/vnd.ms-fontobject', 'eot'],
    ['application/vnd.ms-htmlhelp', 'chm'],
    ['application/vnd.ms-ims', 'ims'],
    ['application/vnd.ms-lrm', 'lrm'],
    ['application/vnd.ms-officetheme', 'thmx'],
    ['application/vnd.ms-outlook', 'msg'],
    ['application/vnd.ms-pki.certstore', 'sst'],
    ['application/vnd.ms-pki.pko', 'pko'],
    ['application/vnd.ms-pki.seccat', 'cat'],
    ['application/vnd.ms-pki.stl', 'stl'],
    ['application/vnd.ms-pkicertstore', 'sst'],
    ['application/vnd.ms-pkiseccat', 'cat'],
    ['application/vnd.ms-pkistl', 'stl'],
    ['application/vnd.ms-powerpoint', ['ppt', 'pot', 'pps', 'ppa', 'pwz']],
    ['application/vnd.ms-powerpoint.addin.macroenabled.12', 'ppam'],
    ['application/vnd.ms-powerpoint.presentation.macroenabled.12', 'pptm'],
    ['application/vnd.ms-powerpoint.slide.macroenabled.12', 'sldm'],
    ['application/vnd.ms-powerpoint.slideshow.macroenabled.12', 'ppsm'],
    ['application/vnd.ms-powerpoint.template.macroenabled.12', 'potm'],
    ['application/vnd.ms-project', 'mpp'],
    ['application/vnd.ms-word.document.macroenabled.12', 'docm'],
    ['application/vnd.ms-word.template.macroenabled.12', 'dotm'],
    ['application/vnd.ms-works', ['wks', 'wcm', 'wdb', 'wps']],
    ['application/vnd.ms-wpl', 'wpl'],
    ['application/vnd.ms-xpsdocument', 'xps'],
    ['application/vnd.mseq', 'mseq'],
    ['application/vnd.musician', 'mus'],
    ['application/vnd.muvee.style', 'msty'],
    ['application/vnd.neurolanguage.nlu', 'nlu'],
    ['application/vnd.noblenet-directory', 'nnd'],
    ['application/vnd.noblenet-sealer', 'nns'],
    ['application/vnd.noblenet-web', 'nnw'],
    ['application/vnd.nokia.configuration-message', 'ncm'],
    ['application/vnd.nokia.n-gage.data', 'ngdat'],
    ['application/vnd.nokia.n-gage.symbian.install', 'n-gage'],
    ['application/vnd.nokia.radio-preset', 'rpst'],
    ['application/vnd.nokia.radio-presets', 'rpss'],
    ['application/vnd.nokia.ringing-tone', 'rng'],
    ['application/vnd.novadigm.edm', 'edm'],
    ['application/vnd.novadigm.edx', 'edx'],
    ['application/vnd.novadigm.ext', 'ext'],
    ['application/vnd.oasis.opendocument.chart', 'odc'],
    ['application/vnd.oasis.opendocument.chart-template', 'otc'],
    ['application/vnd.oasis.opendocument.database', 'odb'],
    ['application/vnd.oasis.opendocument.formula', 'odf'],
    ['application/vnd.oasis.opendocument.formula-template', 'odft'],
    ['application/vnd.oasis.opendocument.graphics', 'odg'],
    ['application/vnd.oasis.opendocument.graphics-template', 'otg'],
    ['application/vnd.oasis.opendocument.image', 'odi'],
    ['application/vnd.oasis.opendocument.image-template', 'oti'],
    ['application/vnd.oasis.opendocument.presentation', 'odp'],
    ['application/vnd.oasis.opendocument.presentation-template', 'otp'],
    ['application/vnd.oasis.opendocument.spreadsheet', 'ods'],
    ['application/vnd.oasis.opendocument.spreadsheet-template', 'ots'],
    ['application/vnd.oasis.opendocument.text', 'odt'],
    ['application/vnd.oasis.opendocument.text-master', 'odm'],
    ['application/vnd.oasis.opendocument.text-template', 'ott'],
    ['application/vnd.oasis.opendocument.text-web', 'oth'],
    ['application/vnd.olpc-sugar', 'xo'],
    ['application/vnd.oma.dd2+xml', 'dd2'],
    ['application/vnd.openofficeorg.extension', 'oxt'],
    ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'pptx'],
    ['application/vnd.openxmlformats-officedocument.presentationml.slide', 'sldx'],
    ['application/vnd.openxmlformats-officedocument.presentationml.slideshow', 'ppsx'],
    ['application/vnd.openxmlformats-officedocument.presentationml.template', 'potx'],
    ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xlsx'],
    ['application/vnd.openxmlformats-officedocument.spreadsheetml.template', 'xltx'],
    ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx'],
    ['application/vnd.openxmlformats-officedocument.wordprocessingml.template', 'dotx'],
    ['application/vnd.osgeo.mapguide.package', 'mgp'],
    ['application/vnd.osgi.dp', 'dp'],
    ['application/vnd.palm', 'pdb'],
    ['application/vnd.pawaafile', 'paw'],
    ['application/vnd.pg.format', 'str'],
    ['application/vnd.pg.osasli', 'ei6'],
    ['application/vnd.picsel', 'efif'],
    ['application/vnd.pmi.widget', 'wg'],
    ['application/vnd.pocketlearn', 'plf'],
    ['application/vnd.powerbuilder6', 'pbd'],
    ['application/vnd.previewsystems.box', 'box'],
    ['application/vnd.proteus.magazine', 'mgz'],
    ['application/vnd.publishare-delta-tree', 'qps'],
    ['application/vnd.pvi.ptid1', 'ptid'],
    ['application/vnd.quark.quarkxpress', 'qxd'],
    ['application/vnd.realvnc.bed', 'bed'],
    ['application/vnd.recordare.musicxml', 'mxl'],
    ['application/vnd.recordare.musicxml+xml', 'musicxml'],
    ['application/vnd.rig.cryptonote', 'cryptonote'],
    ['application/vnd.rim.cod', 'cod'],
    ['application/vnd.rn-realmedia', 'rm'],
    ['application/vnd.rn-realplayer', 'rnx'],
    ['application/vnd.route66.link66+xml', 'link66'],
    ['application/vnd.sailingtracker.track', 'st'],
    ['application/vnd.seemail', 'see'],
    ['application/vnd.sema', 'sema'],
    ['application/vnd.semd', 'semd'],
    ['application/vnd.semf', 'semf'],
    ['application/vnd.shana.informed.formdata', 'ifm'],
    ['application/vnd.shana.informed.formtemplate', 'itp'],
    ['application/vnd.shana.informed.interchange', 'iif'],
    ['application/vnd.shana.informed.package', 'ipk'],
    ['application/vnd.simtech-mindmapper', 'twd'],
    ['application/vnd.smaf', 'mmf'],
    ['application/vnd.smart.teacher', 'teacher'],
    ['application/vnd.solent.sdkm+xml', 'sdkm'],
    ['application/vnd.spotfire.dxp', 'dxp'],
    ['application/vnd.spotfire.sfs', 'sfs'],
    ['application/vnd.stardivision.calc', 'sdc'],
    ['application/vnd.stardivision.draw', 'sda'],
    ['application/vnd.stardivision.impress', 'sdd'],
    ['application/vnd.stardivision.math', 'smf'],
    ['application/vnd.stardivision.writer', 'sdw'],
    ['application/vnd.stardivision.writer-global', 'sgl'],
    ['application/vnd.stepmania.stepchart', 'sm'],
    ['application/vnd.sun.xml.calc', 'sxc'],
    ['application/vnd.sun.xml.calc.template', 'stc'],
    ['application/vnd.sun.xml.draw', 'sxd'],
    ['application/vnd.sun.xml.draw.template', 'std'],
    ['application/vnd.sun.xml.impress', 'sxi'],
    ['application/vnd.sun.xml.impress.template', 'sti'],
    ['application/vnd.sun.xml.math', 'sxm'],
    ['application/vnd.sun.xml.writer', 'sxw'],
    ['application/vnd.sun.xml.writer.global', 'sxg'],
    ['application/vnd.sun.xml.writer.template', 'stw'],
    ['application/vnd.sus-calendar', 'sus'],
    ['application/vnd.svd', 'svd'],
    ['application/vnd.symbian.install', 'sis'],
    ['application/vnd.syncml+xml', 'xsm'],
    ['application/vnd.syncml.dm+wbxml', 'bdm'],
    ['application/vnd.syncml.dm+xml', 'xdm'],
    ['application/vnd.tao.intent-module-archive', 'tao'],
    ['application/vnd.tmobile-livetv', 'tmo'],
    ['application/vnd.trid.tpt', 'tpt'],
    ['application/vnd.triscape.mxs', 'mxs'],
    ['application/vnd.trueapp', 'tra'],
    ['application/vnd.ufdl', 'ufd'],
    ['application/vnd.uiq.theme', 'utz'],
    ['application/vnd.umajin', 'umj'],
    ['application/vnd.unity', 'unityweb'],
    ['application/vnd.uoml+xml', 'uoml'],
    ['application/vnd.vcx', 'vcx'],
    ['application/vnd.visio', 'vsd'],
    ['application/vnd.visionary', 'vis'],
    ['application/vnd.vsf', 'vsf'],
    ['application/vnd.wap.wbxml', 'wbxml'],
    ['application/vnd.wap.wmlc', 'wmlc'],
    ['application/vnd.wap.wmlscriptc', 'wmlsc'],
    ['application/vnd.webturbo', 'wtb'],
    ['application/vnd.wolfram.player', 'nbp'],
    ['application/vnd.wordperfect', 'wpd'],
    ['application/vnd.wqd', 'wqd'],
    ['application/vnd.wt.stf', 'stf'],
    ['application/vnd.xara', ['web', 'xar']],
    ['application/vnd.xfdl', 'xfdl'],
    ['application/vnd.yamaha.hv-dic', 'hvd'],
    ['application/vnd.yamaha.hv-script', 'hvs'],
    ['application/vnd.yamaha.hv-voice', 'hvp'],
    ['application/vnd.yamaha.openscoreformat', 'osf'],
    ['application/vnd.yamaha.openscoreformat.osfpvg+xml', 'osfpvg'],
    ['application/vnd.yamaha.smaf-audio', 'saf'],
    ['application/vnd.yamaha.smaf-phrase', 'spf'],
    ['application/vnd.yellowriver-custom-menu', 'cmp'],
    ['application/vnd.zul', 'zir'],
    ['application/vnd.zzazz.deck+xml', 'zaz'],
    ['application/vocaltec-media-desc', 'vmd'],
    ['application/vocaltec-media-file', 'vmf'],
    ['application/voicexml+xml', 'vxml'],
    ['application/widget', 'wgt'],
    ['application/winhlp', 'hlp'],
    ['application/wordperfect', ['wp', 'wp5', 'wp6', 'wpd']],
    ['application/wordperfect6.0', ['w60', 'wp5']],
    ['application/wordperfect6.1', 'w61'],
    ['application/wsdl+xml', 'wsdl'],
    ['application/wspolicy+xml', 'wspolicy'],
    ['application/x-123', 'wk1'],
    ['application/x-7z-compressed', '7z'],
    ['application/x-abiword', 'abw'],
    ['application/x-ace-compressed', 'ace'],
    ['application/x-aim', 'aim'],
    ['application/x-authorware-bin', 'aab'],
    ['application/x-authorware-map', 'aam'],
    ['application/x-authorware-seg', 'aas'],
    ['application/x-bcpio', 'bcpio'],
    ['application/x-binary', 'bin'],
    ['application/x-binhex40', 'hqx'],
    ['application/x-bittorrent', 'torrent'],
    ['application/x-bsh', ['bsh', 'sh', 'shar']],
    ['application/x-bytecode.elisp', 'elc'],
    ['application/x-bytecode.python', 'pyc'],
    ['application/x-bzip', 'bz'],
    ['application/x-bzip2', ['boz', 'bz2']],
    ['application/x-cdf', 'cdf'],
    ['application/x-cdlink', 'vcd'],
    ['application/x-chat', ['cha', 'chat']],
    ['application/x-chess-pgn', 'pgn'],
    ['application/x-cmu-raster', 'ras'],
    ['application/x-cocoa', 'cco'],
    ['application/x-compactpro', 'cpt'],
    ['application/x-compress', 'z'],
    ['application/x-compressed', ['tgz', 'gz', 'z', 'zip']],
    ['application/x-conference', 'nsc'],
    ['application/x-cpio', 'cpio'],
    ['application/x-cpt', 'cpt'],
    ['application/x-csh', 'csh'],
    ['application/x-debian-package', 'deb'],
    ['application/x-deepv', 'deepv'],
    ['application/x-director', ['dir', 'dcr', 'dxr']],
    ['application/x-doom', 'wad'],
    ['application/x-dtbncx+xml', 'ncx'],
    ['application/x-dtbook+xml', 'dtb'],
    ['application/x-dtbresource+xml', 'res'],
    ['application/x-dvi', 'dvi'],
    ['application/x-elc', 'elc'],
    ['application/x-envoy', ['env', 'evy']],
    ['application/x-esrehber', 'es'],
    ['application/x-excel', ['xls', 'xla', 'xlb', 'xlc', 'xld', 'xlk', 'xll', 'xlm', 'xlt', 'xlv', 'xlw']],
    ['application/x-font-bdf', 'bdf'],
    ['application/x-font-ghostscript', 'gsf'],
    ['application/x-font-linux-psf', 'psf'],
    ['application/x-font-otf', 'otf'],
    ['application/x-font-pcf', 'pcf'],
    ['application/x-font-snf', 'snf'],
    ['application/x-font-ttf', 'ttf'],
    ['application/x-font-type1', 'pfa'],
    ['application/x-font-woff', 'woff'],
    ['application/x-frame', 'mif'],
    ['application/x-freelance', 'pre'],
    ['application/x-futuresplash', 'spl'],
    ['application/x-gnumeric', 'gnumeric'],
    ['application/x-gsp', 'gsp'],
    ['application/x-gss', 'gss'],
    ['application/x-gtar', 'gtar'],
    ['application/x-gzip', ['gz', 'gzip']],
    ['application/x-hdf', 'hdf'],
    ['application/x-helpfile', ['help', 'hlp']],
    ['application/x-httpd-imap', 'imap'],
    ['application/x-ima', 'ima'],
    ['application/x-internet-signup', ['ins', 'isp']],
    ['application/x-internett-signup', 'ins'],
    ['application/x-inventor', 'iv'],
    ['application/x-ip2', 'ip'],
    ['application/x-iphone', 'iii'],
    ['application/x-java-class', 'class'],
    ['application/x-java-commerce', 'jcm'],
    ['application/x-java-jnlp-file', 'jnlp'],
    ['application/x-javascript', 'js'],
    ['application/x-koan', ['skd', 'skm', 'skp', 'skt']],
    ['application/x-ksh', 'ksh'],
    ['application/x-latex', ['latex', 'ltx']],
    ['application/x-lha', 'lha'],
    ['application/x-lisp', 'lsp'],
    ['application/x-livescreen', 'ivy'],
    ['application/x-lotus', 'wq1'],
    ['application/x-lotusscreencam', 'scm'],
    ['application/x-lzh', 'lzh'],
    ['application/x-lzx', 'lzx'],
    ['application/x-mac-binhex40', 'hqx'],
    ['application/x-macbinary', 'bin'],
    ['application/x-magic-cap-package-1.0', 'mc$'],
    ['application/x-mathcad', 'mcd'],
    ['application/x-meme', 'mm'],
    ['application/x-midi', ['mid', 'midi']],
    ['application/x-mif', 'mif'],
    ['application/x-mix-transfer', 'nix'],
    ['application/x-mobipocket-ebook', 'prc'],
    ['application/x-mplayer2', 'asx'],
    ['application/x-ms-application', 'application'],
    ['application/x-ms-wmd', 'wmd'],
    ['application/x-ms-wmz', 'wmz'],
    ['application/x-ms-xbap', 'xbap'],
    ['application/x-msaccess', 'mdb'],
    ['application/x-msbinder', 'obd'],
    ['application/x-mscardfile', 'crd'],
    ['application/x-msclip', 'clp'],
    ['application/x-msdownload', ['exe', 'dll']],
    ['application/x-msexcel', ['xls', 'xla', 'xlw']],
    ['application/x-msmediaview', ['mvb', 'm13', 'm14']],
    ['application/x-msmetafile', 'wmf'],
    ['application/x-msmoney', 'mny'],
    ['application/x-mspowerpoint', 'ppt'],
    ['application/x-mspublisher', 'pub'],
    ['application/x-msschedule', 'scd'],
    ['application/x-msterminal', 'trm'],
    ['application/x-mswrite', 'wri'],
    ['application/x-navi-animation', 'ani'],
    ['application/x-navidoc', 'nvd'],
    ['application/x-navimap', 'map'],
    ['application/x-navistyle', 'stl'],
    ['application/x-netcdf', ['cdf', 'nc']],
    ['application/x-newton-compatible-pkg', 'pkg'],
    ['application/x-nokia-9000-communicator-add-on-software', 'aos'],
    ['application/x-omc', 'omc'],
    ['application/x-omcdatamaker', 'omcd'],
    ['application/x-omcregerator', 'omcr'],
    ['application/x-pagemaker', ['pm4', 'pm5']],
    ['application/x-pcl', 'pcl'],
    ['application/x-perfmon', ['pma', 'pmc', 'pml', 'pmr', 'pmw']],
    ['application/x-pixclscript', 'plx'],
    ['application/x-pkcs10', 'p10'],
    ['application/x-pkcs12', ['p12', 'pfx']],
    ['application/x-pkcs7-certificates', ['p7b', 'spc']],
    ['application/x-pkcs7-certreqresp', 'p7r'],
    ['application/x-pkcs7-mime', ['p7m', 'p7c']],
    ['application/x-pkcs7-signature', ['p7s', 'p7a']],
    ['application/x-pointplus', 'css'],
    ['application/x-portable-anymap', 'pnm'],
    ['application/x-project', ['mpc', 'mpt', 'mpv', 'mpx']],
    ['application/x-qpro', 'wb1'],
    ['application/x-rar-compressed', 'rar'],
    ['application/x-rtf', 'rtf'],
    ['application/x-sdp', 'sdp'],
    ['application/x-sea', 'sea'],
    ['application/x-seelogo', 'sl'],
    ['application/x-sh', 'sh'],
    ['application/x-shar', ['shar', 'sh']],
    ['application/x-shockwave-flash', 'swf'],
    ['application/x-silverlight-app', 'xap'],
    ['application/x-sit', 'sit'],
    ['application/x-sprite', ['spr', 'sprite']],
    ['application/x-stuffit', 'sit'],
    ['application/x-stuffitx', 'sitx'],
    ['application/x-sv4cpio', 'sv4cpio'],
    ['application/x-sv4crc', 'sv4crc'],
    ['application/x-tar', 'tar'],
    ['application/x-tbook', ['sbk', 'tbk']],
    ['application/x-tcl', 'tcl'],
    ['application/x-tex', 'tex'],
    ['application/x-tex-tfm', 'tfm'],
    ['application/x-texinfo', ['texi', 'texinfo']],
    ['application/x-troff', ['roff', 't', 'tr']],
    ['application/x-troff-man', 'man'],
    ['application/x-troff-me', 'me'],
    ['application/x-troff-ms', 'ms'],
    ['application/x-troff-msvideo', 'avi'],
    ['application/x-ustar', 'ustar'],
    ['application/x-visio', ['vsd', 'vst', 'vsw']],
    ['application/x-vnd.audioexplosion.mzz', 'mzz'],
    ['application/x-vnd.ls-xpix', 'xpix'],
    ['application/x-vrml', 'vrml'],
    ['application/x-wais-source', ['src', 'wsrc']],
    ['application/x-winhelp', 'hlp'],
    ['application/x-wintalk', 'wtk'],
    ['application/x-world', ['wrl', 'svr']],
    ['application/x-wpwin', 'wpd'],
    ['application/x-wri', 'wri'],
    ['application/x-x509-ca-cert', ['cer', 'crt', 'der']],
    ['application/x-x509-user-cert', 'crt'],
    ['application/x-xfig', 'fig'],
    ['application/x-xpinstall', 'xpi'],
    ['application/x-zip-compressed', 'zip'],
    ['application/xcap-diff+xml', 'xdf'],
    ['application/xenc+xml', 'xenc'],
    ['application/xhtml+xml', 'xhtml'],
    ['application/xml', 'xml'],
    ['application/xml-dtd', 'dtd'],
    ['application/xop+xml', 'xop'],
    ['application/xslt+xml', 'xslt'],
    ['application/xspf+xml', 'xspf'],
    ['application/xv+xml', 'mxml'],
    ['application/yang', 'yang'],
    ['application/yin+xml', 'yin'],
    ['application/ynd.ms-pkipko', 'pko'],
    ['application/zip', 'zip'],
    ['audio/adpcm', 'adp'],
    ['audio/aiff', ['aiff', 'aif', 'aifc']],
    ['audio/basic', ['snd', 'au']],
    ['audio/it', 'it'],
    ['audio/make', ['funk', 'my', 'pfunk']],
    ['audio/make.my.funk', 'pfunk'],
    ['audio/mid', ['mid', 'rmi']],
    ['audio/midi', ['midi', 'kar', 'mid']],
    ['audio/mod', 'mod'],
    ['audio/mp4', 'mp4a'],
    ['audio/mpeg', ['mpga', 'mp3', 'm2a', 'mp2', 'mpa', 'mpg']],
    ['audio/mpeg3', 'mp3'],
    ['audio/nspaudio', ['la', 'lma']],
    ['audio/ogg', 'oga'],
    ['audio/s3m', 's3m'],
    ['audio/tsp-audio', 'tsi'],
    ['audio/tsplayer', 'tsp'],
    ['audio/vnd.dece.audio', 'uva'],
    ['audio/vnd.digital-winds', 'eol'],
    ['audio/vnd.dra', 'dra'],
    ['audio/vnd.dts', 'dts'],
    ['audio/vnd.dts.hd', 'dtshd'],
    ['audio/vnd.lucent.voice', 'lvp'],
    ['audio/vnd.ms-playready.media.pya', 'pya'],
    ['audio/vnd.nuera.ecelp4800', 'ecelp4800'],
    ['audio/vnd.nuera.ecelp7470', 'ecelp7470'],
    ['audio/vnd.nuera.ecelp9600', 'ecelp9600'],
    ['audio/vnd.qcelp', 'qcp'],
    ['audio/vnd.rip', 'rip'],
    ['audio/voc', 'voc'],
    ['audio/voxware', 'vox'],
    ['audio/wav', 'wav'],
    ['audio/webm', 'weba'],
    ['audio/x-aac', 'aac'],
    ['audio/x-adpcm', 'snd'],
    ['audio/x-aiff', ['aiff', 'aif', 'aifc']],
    ['audio/x-au', 'au'],
    ['audio/x-gsm', ['gsd', 'gsm']],
    ['audio/x-jam', 'jam'],
    ['audio/x-liveaudio', 'lam'],
    ['audio/x-mid', ['mid', 'midi']],
    ['audio/x-midi', ['midi', 'mid']],
    ['audio/x-mod', 'mod'],
    ['audio/x-mpeg', 'mp2'],
    ['audio/x-mpeg-3', 'mp3'],
    ['audio/x-mpegurl', 'm3u'],
    ['audio/x-mpequrl', 'm3u'],
    ['audio/x-ms-wax', 'wax'],
    ['audio/x-ms-wma', 'wma'],
    ['audio/x-nspaudio', ['la', 'lma']],
    ['audio/x-pn-realaudio', ['ra', 'ram', 'rm', 'rmm', 'rmp']],
    ['audio/x-pn-realaudio-plugin', ['ra', 'rmp', 'rpm']],
    ['audio/x-psid', 'sid'],
    ['audio/x-realaudio', 'ra'],
    ['audio/x-twinvq', 'vqf'],
    ['audio/x-twinvq-plugin', ['vqe', 'vql']],
    ['audio/x-vnd.audioexplosion.mjuicemediafile', 'mjf'],
    ['audio/x-voc', 'voc'],
    ['audio/x-wav', 'wav'],
    ['audio/xm', 'xm'],
    ['chemical/x-cdx', 'cdx'],
    ['chemical/x-cif', 'cif'],
    ['chemical/x-cmdf', 'cmdf'],
    ['chemical/x-cml', 'cml'],
    ['chemical/x-csml', 'csml'],
    ['chemical/x-pdb', ['pdb', 'xyz']],
    ['chemical/x-xyz', 'xyz'],
    ['drawing/x-dwf', 'dwf'],
    ['i-world/i-vrml', 'ivr'],
    ['image/bmp', ['bmp', 'bm']],
    ['image/cgm', 'cgm'],
    ['image/cis-cod', 'cod'],
    ['image/cmu-raster', ['ras', 'rast']],
    ['image/fif', 'fif'],
    ['image/florian', ['flo', 'turbot']],
    ['image/g3fax', 'g3'],
    ['image/gif', 'gif'],
    ['image/ief', ['ief', 'iefs']],
    ['image/jpeg', ['jpeg', 'jpe', 'jpg', 'jfif', 'jfif-tbnl']],
    ['image/jutvision', 'jut'],
    ['image/ktx', 'ktx'],
    ['image/naplps', ['nap', 'naplps']],
    ['image/pict', ['pic', 'pict']],
    ['image/pipeg', 'jfif'],
    ['image/pjpeg', ['jfif', 'jpe', 'jpeg', 'jpg']],
    ['image/png', ['png', 'x-png']],
    ['image/prs.btif', 'btif'],
    ['image/svg+xml', 'svg'],
    ['image/tiff', ['tif', 'tiff']],
    ['image/vasa', 'mcf'],
    ['image/vnd.adobe.photoshop', 'psd'],
    ['image/vnd.dece.graphic', 'uvi'],
    ['image/vnd.djvu', 'djvu'],
    ['image/vnd.dvb.subtitle', 'sub'],
    ['image/vnd.dwg', ['dwg', 'dxf', 'svf']],
    ['image/vnd.dxf', 'dxf'],
    ['image/vnd.fastbidsheet', 'fbs'],
    ['image/vnd.fpx', 'fpx'],
    ['image/vnd.fst', 'fst'],
    ['image/vnd.fujixerox.edmics-mmr', 'mmr'],
    ['image/vnd.fujixerox.edmics-rlc', 'rlc'],
    ['image/vnd.ms-modi', 'mdi'],
    ['image/vnd.net-fpx', ['fpx', 'npx']],
    ['image/vnd.rn-realflash', 'rf'],
    ['image/vnd.rn-realpix', 'rp'],
    ['image/vnd.wap.wbmp', 'wbmp'],
    ['image/vnd.xiff', 'xif'],
    ['image/webp', 'webp'],
    ['image/x-cmu-raster', 'ras'],
    ['image/x-cmx', 'cmx'],
    ['image/x-dwg', ['dwg', 'dxf', 'svf']],
    ['image/x-freehand', 'fh'],
    ['image/x-icon', 'ico'],
    ['image/x-jg', 'art'],
    ['image/x-jps', 'jps'],
    ['image/x-niff', ['niff', 'nif']],
    ['image/x-pcx', 'pcx'],
    ['image/x-pict', ['pct', 'pic']],
    ['image/x-portable-anymap', 'pnm'],
    ['image/x-portable-bitmap', 'pbm'],
    ['image/x-portable-graymap', 'pgm'],
    ['image/x-portable-greymap', 'pgm'],
    ['image/x-portable-pixmap', 'ppm'],
    ['image/x-quicktime', ['qif', 'qti', 'qtif']],
    ['image/x-rgb', 'rgb'],
    ['image/x-tiff', ['tif', 'tiff']],
    ['image/x-windows-bmp', 'bmp'],
    ['image/x-xbitmap', 'xbm'],
    ['image/x-xbm', 'xbm'],
    ['image/x-xpixmap', ['xpm', 'pm']],
    ['image/x-xwd', 'xwd'],
    ['image/x-xwindowdump', 'xwd'],
    ['image/xbm', 'xbm'],
    ['image/xpm', 'xpm'],
    ['message/rfc822', ['eml', 'mht', 'mhtml', 'nws', 'mime']],
    ['model/iges', ['iges', 'igs']],
    ['model/mesh', 'msh'],
    ['model/vnd.collada+xml', 'dae'],
    ['model/vnd.dwf', 'dwf'],
    ['model/vnd.gdl', 'gdl'],
    ['model/vnd.gtw', 'gtw'],
    ['model/vnd.mts', 'mts'],
    ['model/vnd.vtu', 'vtu'],
    ['model/vrml', ['vrml', 'wrl', 'wrz']],
    ['model/x-pov', 'pov'],
    ['multipart/x-gzip', 'gzip'],
    ['multipart/x-ustar', 'ustar'],
    ['multipart/x-zip', 'zip'],
    ['music/crescendo', ['mid', 'midi']],
    ['music/x-karaoke', 'kar'],
    ['paleovu/x-pv', 'pvu'],
    ['text/asp', 'asp'],
    ['text/calendar', 'ics'],
    ['text/css', 'css'],
    ['text/csv', 'csv'],
    ['text/ecmascript', 'js'],
    ['text/h323', '323'],
    ['text/html', ['html', 'htm', 'stm', 'acgi', 'htmls', 'htx', 'shtml']],
    ['text/iuls', 'uls'],
    ['text/javascript', 'js'],
    ['text/mcf', 'mcf'],
    ['text/n3', 'n3'],
    ['text/pascal', 'pas'],
    [
        'text/plain',
        [
            'txt',
            'bas',
            'c',
            'h',
            'c++',
            'cc',
            'com',
            'conf',
            'cxx',
            'def',
            'f',
            'f90',
            'for',
            'g',
            'hh',
            'idc',
            'jav',
            'java',
            'list',
            'log',
            'lst',
            'm',
            'mar',
            'pl',
            'sdml',
            'text'
        ]
    ],
    ['text/plain-bas', 'par'],
    ['text/prs.lines.tag', 'dsc'],
    ['text/richtext', ['rtx', 'rt', 'rtf']],
    ['text/scriplet', 'wsc'],
    ['text/scriptlet', 'sct'],
    ['text/sgml', ['sgm', 'sgml']],
    ['text/tab-separated-values', 'tsv'],
    ['text/troff', 't'],
    ['text/turtle', 'ttl'],
    ['text/uri-list', ['uni', 'unis', 'uri', 'uris']],
    ['text/vnd.abc', 'abc'],
    ['text/vnd.curl', 'curl'],
    ['text/vnd.curl.dcurl', 'dcurl'],
    ['text/vnd.curl.mcurl', 'mcurl'],
    ['text/vnd.curl.scurl', 'scurl'],
    ['text/vnd.fly', 'fly'],
    ['text/vnd.fmi.flexstor', 'flx'],
    ['text/vnd.graphviz', 'gv'],
    ['text/vnd.in3d.3dml', '3dml'],
    ['text/vnd.in3d.spot', 'spot'],
    ['text/vnd.rn-realtext', 'rt'],
    ['text/vnd.sun.j2me.app-descriptor', 'jad'],
    ['text/vnd.wap.wml', 'wml'],
    ['text/vnd.wap.wmlscript', 'wmls'],
    ['text/webviewhtml', 'htt'],
    ['text/x-asm', ['asm', 's']],
    ['text/x-audiosoft-intra', 'aip'],
    ['text/x-c', ['c', 'cc', 'cpp']],
    ['text/x-component', 'htc'],
    ['text/x-fortran', ['for', 'f', 'f77', 'f90']],
    ['text/x-h', ['h', 'hh']],
    ['text/x-java-source', ['java', 'jav']],
    ['text/x-java-source,java', 'java'],
    ['text/x-la-asf', 'lsx'],
    ['text/x-m', 'm'],
    ['text/x-pascal', 'p'],
    ['text/x-script', 'hlb'],
    ['text/x-script.csh', 'csh'],
    ['text/x-script.elisp', 'el'],
    ['text/x-script.guile', 'scm'],
    ['text/x-script.ksh', 'ksh'],
    ['text/x-script.lisp', 'lsp'],
    ['text/x-script.perl', 'pl'],
    ['text/x-script.perl-module', 'pm'],
    ['text/x-script.phyton', 'py'],
    ['text/x-script.rexx', 'rexx'],
    ['text/x-script.scheme', 'scm'],
    ['text/x-script.sh', 'sh'],
    ['text/x-script.tcl', 'tcl'],
    ['text/x-script.tcsh', 'tcsh'],
    ['text/x-script.zsh', 'zsh'],
    ['text/x-server-parsed-html', ['shtml', 'ssi']],
    ['text/x-setext', 'etx'],
    ['text/x-sgml', ['sgm', 'sgml']],
    ['text/x-speech', ['spc', 'talk']],
    ['text/x-uil', 'uil'],
    ['text/x-uuencode', ['uu', 'uue']],
    ['text/x-vcalendar', 'vcs'],
    ['text/x-vcard', 'vcf'],
    ['text/xml', 'xml'],
    ['video/3gpp', '3gp'],
    ['video/3gpp2', '3g2'],
    ['video/animaflex', 'afl'],
    ['video/avi', 'avi'],
    ['video/avs-video', 'avs'],
    ['video/dl', 'dl'],
    ['video/fli', 'fli'],
    ['video/gl', 'gl'],
    ['video/h261', 'h261'],
    ['video/h263', 'h263'],
    ['video/h264', 'h264'],
    ['video/jpeg', 'jpgv'],
    ['video/jpm', 'jpm'],
    ['video/mj2', 'mj2'],
    ['video/mp4', 'mp4'],
    ['video/mpeg', ['mpeg', 'mp2', 'mpa', 'mpe', 'mpg', 'mpv2', 'm1v', 'm2v', 'mp3']],
    ['video/msvideo', 'avi'],
    ['video/ogg', 'ogv'],
    ['video/quicktime', ['mov', 'qt', 'moov']],
    ['video/vdo', 'vdo'],
    ['video/vivo', ['viv', 'vivo']],
    ['video/vnd.dece.hd', 'uvh'],
    ['video/vnd.dece.mobile', 'uvm'],
    ['video/vnd.dece.pd', 'uvp'],
    ['video/vnd.dece.sd', 'uvs'],
    ['video/vnd.dece.video', 'uvv'],
    ['video/vnd.fvt', 'fvt'],
    ['video/vnd.mpegurl', 'mxu'],
    ['video/vnd.ms-playready.media.pyv', 'pyv'],
    ['video/vnd.rn-realvideo', 'rv'],
    ['video/vnd.uvvu.mp4', 'uvu'],
    ['video/vnd.vivo', ['viv', 'vivo']],
    ['video/vosaic', 'vos'],
    ['video/webm', 'webm'],
    ['video/x-amt-demorun', 'xdr'],
    ['video/x-amt-showrun', 'xsr'],
    ['video/x-atomic3d-feature', 'fmf'],
    ['video/x-dl', 'dl'],
    ['video/x-dv', ['dif', 'dv']],
    ['video/x-f4v', 'f4v'],
    ['video/x-fli', 'fli'],
    ['video/x-flv', 'flv'],
    ['video/x-gl', 'gl'],
    ['video/x-isvideo', 'isu'],
    ['video/x-la-asf', ['lsf', 'lsx']],
    ['video/x-m4v', 'm4v'],
    ['video/x-motion-jpeg', 'mjpg'],
    ['video/x-mpeg', ['mp3', 'mp2']],
    ['video/x-mpeq2a', 'mp2'],
    ['video/x-ms-asf', ['asf', 'asr', 'asx']],
    ['video/x-ms-asf-plugin', 'asx'],
    ['video/x-ms-wm', 'wm'],
    ['video/x-ms-wmv', 'wmv'],
    ['video/x-ms-wmx', 'wmx'],
    ['video/x-ms-wvx', 'wvx'],
    ['video/x-msvideo', 'avi'],
    ['video/x-qtc', 'qtc'],
    ['video/x-scm', 'scm'],
    ['video/x-sgi-movie', ['movie', 'mv']],
    ['windows/metafile', 'wmf'],
    ['www/mime', 'mime'],
    ['x-conference/x-cooltalk', 'ice'],
    ['x-music/x-midi', ['mid', 'midi']],
    ['x-world/x-3dmf', ['3dm', '3dmf', 'qd3', 'qd3d']],
    ['x-world/x-svr', 'svr'],
    ['x-world/x-vrml', ['flr', 'vrml', 'wrl', 'wrz', 'xaf', 'xof']],
    ['x-world/x-vrt', 'vrt'],
    ['xgl/drawing', 'xgz'],
    ['xgl/movie', 'xmz']
]);
const extensions = new Map([
    ['123', 'application/vnd.lotus-1-2-3'],
    ['323', 'text/h323'],
    ['*', 'application/octet-stream'],
    ['3dm', 'x-world/x-3dmf'],
    ['3dmf', 'x-world/x-3dmf'],
    ['3dml', 'text/vnd.in3d.3dml'],
    ['3g2', 'video/3gpp2'],
    ['3gp', 'video/3gpp'],
    ['7z', 'application/x-7z-compressed'],
    ['a', 'application/octet-stream'],
    ['aab', 'application/x-authorware-bin'],
    ['aac', 'audio/x-aac'],
    ['aam', 'application/x-authorware-map'],
    ['aas', 'application/x-authorware-seg'],
    ['abc', 'text/vnd.abc'],
    ['abw', 'application/x-abiword'],
    ['ac', 'application/pkix-attr-cert'],
    ['acc', 'application/vnd.americandynamics.acc'],
    ['ace', 'application/x-ace-compressed'],
    ['acgi', 'text/html'],
    ['acu', 'application/vnd.acucobol'],
    ['acx', 'application/internet-property-stream'],
    ['adp', 'audio/adpcm'],
    ['aep', 'application/vnd.audiograph'],
    ['afl', 'video/animaflex'],
    ['afp', 'application/vnd.ibm.modcap'],
    ['ahead', 'application/vnd.ahead.space'],
    ['ai', 'application/postscript'],
    ['aif', ['audio/aiff', 'audio/x-aiff']],
    ['aifc', ['audio/aiff', 'audio/x-aiff']],
    ['aiff', ['audio/aiff', 'audio/x-aiff']],
    ['aim', 'application/x-aim'],
    ['aip', 'text/x-audiosoft-intra'],
    ['air', 'application/vnd.adobe.air-application-installer-package+zip'],
    ['ait', 'application/vnd.dvb.ait'],
    ['ami', 'application/vnd.amiga.ami'],
    ['ani', 'application/x-navi-animation'],
    ['aos', 'application/x-nokia-9000-communicator-add-on-software'],
    ['apk', 'application/vnd.android.package-archive'],
    ['application', 'application/x-ms-application'],
    ['apr', 'application/vnd.lotus-approach'],
    ['aps', 'application/mime'],
    ['arc', 'application/octet-stream'],
    ['arj', ['application/arj', 'application/octet-stream']],
    ['art', 'image/x-jg'],
    ['asf', 'video/x-ms-asf'],
    ['asm', 'text/x-asm'],
    ['aso', 'application/vnd.accpac.simply.aso'],
    ['asp', 'text/asp'],
    ['asr', 'video/x-ms-asf'],
    ['asx', ['video/x-ms-asf', 'application/x-mplayer2', 'video/x-ms-asf-plugin']],
    ['atc', 'application/vnd.acucorp'],
    ['atomcat', 'application/atomcat+xml'],
    ['atomsvc', 'application/atomsvc+xml'],
    ['atx', 'application/vnd.antix.game-component'],
    ['au', ['audio/basic', 'audio/x-au']],
    ['avi', ['video/avi', 'video/msvideo', 'application/x-troff-msvideo', 'video/x-msvideo']],
    ['avs', 'video/avs-video'],
    ['aw', 'application/applixware'],
    ['axs', 'application/olescript'],
    ['azf', 'application/vnd.airzip.filesecure.azf'],
    ['azs', 'application/vnd.airzip.filesecure.azs'],
    ['azw', 'application/vnd.amazon.ebook'],
    ['bas', 'text/plain'],
    ['bcpio', 'application/x-bcpio'],
    ['bdf', 'application/x-font-bdf'],
    ['bdm', 'application/vnd.syncml.dm+wbxml'],
    ['bed', 'application/vnd.realvnc.bed'],
    ['bh2', 'application/vnd.fujitsu.oasysprs'],
    [
        'bin',
        ['application/octet-stream', 'application/mac-binary', 'application/macbinary', 'application/x-macbinary', 'application/x-binary']
    ],
    ['bm', 'image/bmp'],
    ['bmi', 'application/vnd.bmi'],
    ['bmp', ['image/bmp', 'image/x-windows-bmp']],
    ['boo', 'application/book'],
    ['book', 'application/book'],
    ['box', 'application/vnd.previewsystems.box'],
    ['boz', 'application/x-bzip2'],
    ['bsh', 'application/x-bsh'],
    ['btif', 'image/prs.btif'],
    ['bz', 'application/x-bzip'],
    ['bz2', 'application/x-bzip2'],
    ['c', ['text/plain', 'text/x-c']],
    ['c++', 'text/plain'],
    ['c11amc', 'application/vnd.cluetrust.cartomobile-config'],
    ['c11amz', 'application/vnd.cluetrust.cartomobile-config-pkg'],
    ['c4g', 'application/vnd.clonk.c4group'],
    ['cab', 'application/vnd.ms-cab-compressed'],
    ['car', 'application/vnd.curl.car'],
    ['cat', ['application/vnd.ms-pkiseccat', 'application/vnd.ms-pki.seccat']],
    ['cc', ['text/plain', 'text/x-c']],
    ['ccad', 'application/clariscad'],
    ['cco', 'application/x-cocoa'],
    ['ccxml', 'application/ccxml+xml,'],
    ['cdbcmsg', 'application/vnd.contact.cmsg'],
    ['cdf', ['application/cdf', 'application/x-cdf', 'application/x-netcdf']],
    ['cdkey', 'application/vnd.mediastation.cdkey'],
    ['cdmia', 'application/cdmi-capability'],
    ['cdmic', 'application/cdmi-container'],
    ['cdmid', 'application/cdmi-domain'],
    ['cdmio', 'application/cdmi-object'],
    ['cdmiq', 'application/cdmi-queue'],
    ['cdx', 'chemical/x-cdx'],
    ['cdxml', 'application/vnd.chemdraw+xml'],
    ['cdy', 'application/vnd.cinderella'],
    ['cer', ['application/pkix-cert', 'application/x-x509-ca-cert']],
    ['cgm', 'image/cgm'],
    ['cha', 'application/x-chat'],
    ['chat', 'application/x-chat'],
    ['chm', 'application/vnd.ms-htmlhelp'],
    ['chrt', 'application/vnd.kde.kchart'],
    ['cif', 'chemical/x-cif'],
    ['cii', 'application/vnd.anser-web-certificate-issue-initiation'],
    ['cil', 'application/vnd.ms-artgalry'],
    ['cla', 'application/vnd.claymore'],
    [
        'class',
        ['application/octet-stream', 'application/java', 'application/java-byte-code', 'application/java-vm', 'application/x-java-class']
    ],
    ['clkk', 'application/vnd.crick.clicker.keyboard'],
    ['clkp', 'application/vnd.crick.clicker.palette'],
    ['clkt', 'application/vnd.crick.clicker.template'],
    ['clkw', 'application/vnd.crick.clicker.wordbank'],
    ['clkx', 'application/vnd.crick.clicker'],
    ['clp', 'application/x-msclip'],
    ['cmc', 'application/vnd.cosmocaller'],
    ['cmdf', 'chemical/x-cmdf'],
    ['cml', 'chemical/x-cml'],
    ['cmp', 'application/vnd.yellowriver-custom-menu'],
    ['cmx', 'image/x-cmx'],
    ['cod', ['image/cis-cod', 'application/vnd.rim.cod']],
    ['com', ['application/octet-stream', 'text/plain']],
    ['conf', 'text/plain'],
    ['cpio', 'application/x-cpio'],
    ['cpp', 'text/x-c'],
    ['cpt', ['application/mac-compactpro', 'application/x-compactpro', 'application/x-cpt']],
    ['crd', 'application/x-mscardfile'],
    ['crl', ['application/pkix-crl', 'application/pkcs-crl']],
    ['crt', ['application/pkix-cert', 'application/x-x509-user-cert', 'application/x-x509-ca-cert']],
    ['cryptonote', 'application/vnd.rig.cryptonote'],
    ['csh', ['text/x-script.csh', 'application/x-csh']],
    ['csml', 'chemical/x-csml'],
    ['csp', 'application/vnd.commonspace'],
    ['css', ['text/css', 'application/x-pointplus']],
    ['csv', 'text/csv'],
    ['cu', 'application/cu-seeme'],
    ['curl', 'text/vnd.curl'],
    ['cww', 'application/prs.cww'],
    ['cxx', 'text/plain'],
    ['dae', 'model/vnd.collada+xml'],
    ['daf', 'application/vnd.mobius.daf'],
    ['davmount', 'application/davmount+xml'],
    ['dcr', 'application/x-director'],
    ['dcurl', 'text/vnd.curl.dcurl'],
    ['dd2', 'application/vnd.oma.dd2+xml'],
    ['ddd', 'application/vnd.fujixerox.ddd'],
    ['deb', 'application/x-debian-package'],
    ['deepv', 'application/x-deepv'],
    ['def', 'text/plain'],
    ['der', 'application/x-x509-ca-cert'],
    ['dfac', 'application/vnd.dreamfactory'],
    ['dif', 'video/x-dv'],
    ['dir', 'application/x-director'],
    ['dis', 'application/vnd.mobius.dis'],
    ['djvu', 'image/vnd.djvu'],
    ['dl', ['video/dl', 'video/x-dl']],
    ['dll', 'application/x-msdownload'],
    ['dms', 'application/octet-stream'],
    ['dna', 'application/vnd.dna'],
    ['doc', 'application/msword'],
    ['docm', 'application/vnd.ms-word.document.macroenabled.12'],
    ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ['dot', 'application/msword'],
    ['dotm', 'application/vnd.ms-word.template.macroenabled.12'],
    ['dotx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.template'],
    ['dp', ['application/commonground', 'application/vnd.osgi.dp']],
    ['dpg', 'application/vnd.dpgraph'],
    ['dra', 'audio/vnd.dra'],
    ['drw', 'application/drafting'],
    ['dsc', 'text/prs.lines.tag'],
    ['dssc', 'application/dssc+der'],
    ['dtb', 'application/x-dtbook+xml'],
    ['dtd', 'application/xml-dtd'],
    ['dts', 'audio/vnd.dts'],
    ['dtshd', 'audio/vnd.dts.hd'],
    ['dump', 'application/octet-stream'],
    ['dv', 'video/x-dv'],
    ['dvi', 'application/x-dvi'],
    ['dwf', ['model/vnd.dwf', 'drawing/x-dwf']],
    ['dwg', ['application/acad', 'image/vnd.dwg', 'image/x-dwg']],
    ['dxf', ['application/dxf', 'image/vnd.dwg', 'image/vnd.dxf', 'image/x-dwg']],
    ['dxp', 'application/vnd.spotfire.dxp'],
    ['dxr', 'application/x-director'],
    ['ecelp4800', 'audio/vnd.nuera.ecelp4800'],
    ['ecelp7470', 'audio/vnd.nuera.ecelp7470'],
    ['ecelp9600', 'audio/vnd.nuera.ecelp9600'],
    ['edm', 'application/vnd.novadigm.edm'],
    ['edx', 'application/vnd.novadigm.edx'],
    ['efif', 'application/vnd.picsel'],
    ['ei6', 'application/vnd.pg.osasli'],
    ['el', 'text/x-script.elisp'],
    ['elc', ['application/x-elc', 'application/x-bytecode.elisp']],
    ['eml', 'message/rfc822'],
    ['emma', 'application/emma+xml'],
    ['env', 'application/x-envoy'],
    ['eol', 'audio/vnd.digital-winds'],
    ['eot', 'application/vnd.ms-fontobject'],
    ['eps', 'application/postscript'],
    ['epub', 'application/epub+zip'],
    ['es', ['application/ecmascript', 'application/x-esrehber']],
    ['es3', 'application/vnd.eszigno3+xml'],
    ['esf', 'application/vnd.epson.esf'],
    ['etx', 'text/x-setext'],
    ['evy', ['application/envoy', 'application/x-envoy']],
    ['exe', ['application/octet-stream', 'application/x-msdownload']],
    ['exi', 'application/exi'],
    ['ext', 'application/vnd.novadigm.ext'],
    ['ez2', 'application/vnd.ezpix-album'],
    ['ez3', 'application/vnd.ezpix-package'],
    ['f', ['text/plain', 'text/x-fortran']],
    ['f4v', 'video/x-f4v'],
    ['f77', 'text/x-fortran'],
    ['f90', ['text/plain', 'text/x-fortran']],
    ['fbs', 'image/vnd.fastbidsheet'],
    ['fcs', 'application/vnd.isac.fcs'],
    ['fdf', 'application/vnd.fdf'],
    ['fe_launch', 'application/vnd.denovo.fcselayout-link'],
    ['fg5', 'application/vnd.fujitsu.oasysgp'],
    ['fh', 'image/x-freehand'],
    ['fif', ['application/fractals', 'image/fif']],
    ['fig', 'application/x-xfig'],
    ['fli', ['video/fli', 'video/x-fli']],
    ['flo', ['image/florian', 'application/vnd.micrografx.flo']],
    ['flr', 'x-world/x-vrml'],
    ['flv', 'video/x-flv'],
    ['flw', 'application/vnd.kde.kivio'],
    ['flx', 'text/vnd.fmi.flexstor'],
    ['fly', 'text/vnd.fly'],
    ['fm', 'application/vnd.framemaker'],
    ['fmf', 'video/x-atomic3d-feature'],
    ['fnc', 'application/vnd.frogans.fnc'],
    ['for', ['text/plain', 'text/x-fortran']],
    ['fpx', ['image/vnd.fpx', 'image/vnd.net-fpx']],
    ['frl', 'application/freeloader'],
    ['fsc', 'application/vnd.fsc.weblaunch'],
    ['fst', 'image/vnd.fst'],
    ['ftc', 'application/vnd.fluxtime.clip'],
    ['fti', 'application/vnd.anser-web-funds-transfer-initiation'],
    ['funk', 'audio/make'],
    ['fvt', 'video/vnd.fvt'],
    ['fxp', 'application/vnd.adobe.fxp'],
    ['fzs', 'application/vnd.fuzzysheet'],
    ['g', 'text/plain'],
    ['g2w', 'application/vnd.geoplan'],
    ['g3', 'image/g3fax'],
    ['g3w', 'application/vnd.geospace'],
    ['gac', 'application/vnd.groove-account'],
    ['gdl', 'model/vnd.gdl'],
    ['geo', 'application/vnd.dynageo'],
    ['geojson', 'application/geo+json'],
    ['gex', 'application/vnd.geometry-explorer'],
    ['ggb', 'application/vnd.geogebra.file'],
    ['ggt', 'application/vnd.geogebra.tool'],
    ['ghf', 'application/vnd.groove-help'],
    ['gif', 'image/gif'],
    ['gim', 'application/vnd.groove-identity-message'],
    ['gl', ['video/gl', 'video/x-gl']],
    ['gmx', 'application/vnd.gmx'],
    ['gnumeric', 'application/x-gnumeric'],
    ['gph', 'application/vnd.flographit'],
    ['gqf', 'application/vnd.grafeq'],
    ['gram', 'application/srgs'],
    ['grv', 'application/vnd.groove-injector'],
    ['grxml', 'application/srgs+xml'],
    ['gsd', 'audio/x-gsm'],
    ['gsf', 'application/x-font-ghostscript'],
    ['gsm', 'audio/x-gsm'],
    ['gsp', 'application/x-gsp'],
    ['gss', 'application/x-gss'],
    ['gtar', 'application/x-gtar'],
    ['gtm', 'application/vnd.groove-tool-message'],
    ['gtw', 'model/vnd.gtw'],
    ['gv', 'text/vnd.graphviz'],
    ['gxt', 'application/vnd.geonext'],
    ['gz', ['application/x-gzip', 'application/x-compressed']],
    ['gzip', ['multipart/x-gzip', 'application/x-gzip']],
    ['h', ['text/plain', 'text/x-h']],
    ['h261', 'video/h261'],
    ['h263', 'video/h263'],
    ['h264', 'video/h264'],
    ['hal', 'application/vnd.hal+xml'],
    ['hbci', 'application/vnd.hbci'],
    ['hdf', 'application/x-hdf'],
    ['help', 'application/x-helpfile'],
    ['hgl', 'application/vnd.hp-hpgl'],
    ['hh', ['text/plain', 'text/x-h']],
    ['hlb', 'text/x-script'],
    ['hlp', ['application/winhlp', 'application/hlp', 'application/x-helpfile', 'application/x-winhelp']],
    ['hpg', 'application/vnd.hp-hpgl'],
    ['hpgl', 'application/vnd.hp-hpgl'],
    ['hpid', 'application/vnd.hp-hpid'],
    ['hps', 'application/vnd.hp-hps'],
    [
        'hqx',
        [
            'application/mac-binhex40',
            'application/binhex',
            'application/binhex4',
            'application/mac-binhex',
            'application/x-binhex40',
            'application/x-mac-binhex40'
        ]
    ],
    ['hta', 'application/hta'],
    ['htc', 'text/x-component'],
    ['htke', 'application/vnd.kenameaapp'],
    ['htm', 'text/html'],
    ['html', 'text/html'],
    ['htmls', 'text/html'],
    ['htt', 'text/webviewhtml'],
    ['htx', 'text/html'],
    ['hvd', 'application/vnd.yamaha.hv-dic'],
    ['hvp', 'application/vnd.yamaha.hv-voice'],
    ['hvs', 'application/vnd.yamaha.hv-script'],
    ['i2g', 'application/vnd.intergeo'],
    ['icc', 'application/vnd.iccprofile'],
    ['ice', 'x-conference/x-cooltalk'],
    ['ico', 'image/x-icon'],
    ['ics', 'text/calendar'],
    ['idc', 'text/plain'],
    ['ief', 'image/ief'],
    ['iefs', 'image/ief'],
    ['ifm', 'application/vnd.shana.informed.formdata'],
    ['iges', ['application/iges', 'model/iges']],
    ['igl', 'application/vnd.igloader'],
    ['igm', 'application/vnd.insors.igm'],
    ['igs', ['application/iges', 'model/iges']],
    ['igx', 'application/vnd.micrografx.igx'],
    ['iif', 'application/vnd.shana.informed.interchange'],
    ['iii', 'application/x-iphone'],
    ['ima', 'application/x-ima'],
    ['imap', 'application/x-httpd-imap'],
    ['imp', 'application/vnd.accpac.simply.imp'],
    ['ims', 'application/vnd.ms-ims'],
    ['inf', 'application/inf'],
    ['ins', ['application/x-internet-signup', 'application/x-internett-signup']],
    ['ip', 'application/x-ip2'],
    ['ipfix', 'application/ipfix'],
    ['ipk', 'application/vnd.shana.informed.package'],
    ['irm', 'application/vnd.ibm.rights-management'],
    ['irp', 'application/vnd.irepository.package+xml'],
    ['isp', 'application/x-internet-signup'],
    ['isu', 'video/x-isvideo'],
    ['it', 'audio/it'],
    ['itp', 'application/vnd.shana.informed.formtemplate'],
    ['iv', 'application/x-inventor'],
    ['ivp', 'application/vnd.immervision-ivp'],
    ['ivr', 'i-world/i-vrml'],
    ['ivu', 'application/vnd.immervision-ivu'],
    ['ivy', 'application/x-livescreen'],
    ['jad', 'text/vnd.sun.j2me.app-descriptor'],
    ['jam', ['application/vnd.jam', 'audio/x-jam']],
    ['jar', 'application/java-archive'],
    ['jav', ['text/plain', 'text/x-java-source']],
    ['java', ['text/plain', 'text/x-java-source,java', 'text/x-java-source']],
    ['jcm', 'application/x-java-commerce'],
    ['jfif', ['image/pipeg', 'image/jpeg', 'image/pjpeg']],
    ['jfif-tbnl', 'image/jpeg'],
    ['jisp', 'application/vnd.jisp'],
    ['jlt', 'application/vnd.hp-jlyt'],
    ['jnlp', 'application/x-java-jnlp-file'],
    ['joda', 'application/vnd.joost.joda-archive'],
    ['jpe', ['image/jpeg', 'image/pjpeg']],
    ['jpeg', ['image/jpeg', 'image/pjpeg']],
    ['jpg', ['image/jpeg', 'image/pjpeg']],
    ['jpgv', 'video/jpeg'],
    ['jpm', 'video/jpm'],
    ['jps', 'image/x-jps'],
    ['js', ['application/javascript', 'application/ecmascript', 'text/javascript', 'text/ecmascript', 'application/x-javascript']],
    ['json', 'application/json'],
    ['jut', 'image/jutvision'],
    ['kar', ['audio/midi', 'music/x-karaoke']],
    ['karbon', 'application/vnd.kde.karbon'],
    ['kfo', 'application/vnd.kde.kformula'],
    ['kia', 'application/vnd.kidspiration'],
    ['kml', 'application/vnd.google-earth.kml+xml'],
    ['kmz', 'application/vnd.google-earth.kmz'],
    ['kne', 'application/vnd.kinar'],
    ['kon', 'application/vnd.kde.kontour'],
    ['kpr', 'application/vnd.kde.kpresenter'],
    ['ksh', ['application/x-ksh', 'text/x-script.ksh']],
    ['ksp', 'application/vnd.kde.kspread'],
    ['ktx', 'image/ktx'],
    ['ktz', 'application/vnd.kahootz'],
    ['kwd', 'application/vnd.kde.kword'],
    ['la', ['audio/nspaudio', 'audio/x-nspaudio']],
    ['lam', 'audio/x-liveaudio'],
    ['lasxml', 'application/vnd.las.las+xml'],
    ['latex', 'application/x-latex'],
    ['lbd', 'application/vnd.llamagraphics.life-balance.desktop'],
    ['lbe', 'application/vnd.llamagraphics.life-balance.exchange+xml'],
    ['les', 'application/vnd.hhe.lesson-player'],
    ['lha', ['application/octet-stream', 'application/lha', 'application/x-lha']],
    ['lhx', 'application/octet-stream'],
    ['link66', 'application/vnd.route66.link66+xml'],
    ['list', 'text/plain'],
    ['lma', ['audio/nspaudio', 'audio/x-nspaudio']],
    ['log', 'text/plain'],
    ['lrm', 'application/vnd.ms-lrm'],
    ['lsf', 'video/x-la-asf'],
    ['lsp', ['application/x-lisp', 'text/x-script.lisp']],
    ['lst', 'text/plain'],
    ['lsx', ['video/x-la-asf', 'text/x-la-asf']],
    ['ltf', 'application/vnd.frogans.ltf'],
    ['ltx', 'application/x-latex'],
    ['lvp', 'audio/vnd.lucent.voice'],
    ['lwp', 'application/vnd.lotus-wordpro'],
    ['lzh', ['application/octet-stream', 'application/x-lzh']],
    ['lzx', ['application/lzx', 'application/octet-stream', 'application/x-lzx']],
    ['m', ['text/plain', 'text/x-m']],
    ['m13', 'application/x-msmediaview'],
    ['m14', 'application/x-msmediaview'],
    ['m1v', 'video/mpeg'],
    ['m21', 'application/mp21'],
    ['m2a', 'audio/mpeg'],
    ['m2v', 'video/mpeg'],
    ['m3u', ['audio/x-mpegurl', 'audio/x-mpequrl']],
    ['m3u8', 'application/vnd.apple.mpegurl'],
    ['m4v', 'video/x-m4v'],
    ['ma', 'application/mathematica'],
    ['mads', 'application/mads+xml'],
    ['mag', 'application/vnd.ecowin.chart'],
    ['man', 'application/x-troff-man'],
    ['map', 'application/x-navimap'],
    ['mar', 'text/plain'],
    ['mathml', 'application/mathml+xml'],
    ['mbd', 'application/mbedlet'],
    ['mbk', 'application/vnd.mobius.mbk'],
    ['mbox', 'application/mbox'],
    ['mc$', 'application/x-magic-cap-package-1.0'],
    ['mc1', 'application/vnd.medcalcdata'],
    ['mcd', ['application/mcad', 'application/vnd.mcd', 'application/x-mathcad']],
    ['mcf', ['image/vasa', 'text/mcf']],
    ['mcp', 'application/netmc'],
    ['mcurl', 'text/vnd.curl.mcurl'],
    ['mdb', 'application/x-msaccess'],
    ['mdi', 'image/vnd.ms-modi'],
    ['me', 'application/x-troff-me'],
    ['meta4', 'application/metalink4+xml'],
    ['mets', 'application/mets+xml'],
    ['mfm', 'application/vnd.mfmp'],
    ['mgp', 'application/vnd.osgeo.mapguide.package'],
    ['mgz', 'application/vnd.proteus.magazine'],
    ['mht', 'message/rfc822'],
    ['mhtml', 'message/rfc822'],
    ['mid', ['audio/mid', 'audio/midi', 'music/crescendo', 'x-music/x-midi', 'audio/x-midi', 'application/x-midi', 'audio/x-mid']],
    ['midi', ['audio/midi', 'music/crescendo', 'x-music/x-midi', 'audio/x-midi', 'application/x-midi', 'audio/x-mid']],
    ['mif', ['application/vnd.mif', 'application/x-mif', 'application/x-frame']],
    ['mime', ['message/rfc822', 'www/mime']],
    ['mj2', 'video/mj2'],
    ['mjf', 'audio/x-vnd.audioexplosion.mjuicemediafile'],
    ['mjpg', 'video/x-motion-jpeg'],
    ['mlp', 'application/vnd.dolby.mlp'],
    ['mm', ['application/base64', 'application/x-meme']],
    ['mmd', 'application/vnd.chipnuts.karaoke-mmd'],
    ['mme', 'application/base64'],
    ['mmf', 'application/vnd.smaf'],
    ['mmr', 'image/vnd.fujixerox.edmics-mmr'],
    ['mny', 'application/x-msmoney'],
    ['mod', ['audio/mod', 'audio/x-mod']],
    ['mods', 'application/mods+xml'],
    ['moov', 'video/quicktime'],
    ['mov', 'video/quicktime'],
    ['movie', 'video/x-sgi-movie'],
    ['mp2', ['video/mpeg', 'audio/mpeg', 'video/x-mpeg', 'audio/x-mpeg', 'video/x-mpeq2a']],
    ['mp3', ['audio/mpeg', 'audio/mpeg3', 'video/mpeg', 'audio/x-mpeg-3', 'video/x-mpeg']],
    ['mp4', ['video/mp4', 'application/mp4']],
    ['mp4a', 'audio/mp4'],
    ['mpa', ['video/mpeg', 'audio/mpeg']],
    ['mpc', ['application/vnd.mophun.certificate', 'application/x-project']],
    ['mpe', 'video/mpeg'],
    ['mpeg', 'video/mpeg'],
    ['mpg', ['video/mpeg', 'audio/mpeg']],
    ['mpga', 'audio/mpeg'],
    ['mpkg', 'application/vnd.apple.installer+xml'],
    ['mpm', 'application/vnd.blueice.multipass'],
    ['mpn', 'application/vnd.mophun.application'],
    ['mpp', 'application/vnd.ms-project'],
    ['mpt', 'application/x-project'],
    ['mpv', 'application/x-project'],
    ['mpv2', 'video/mpeg'],
    ['mpx', 'application/x-project'],
    ['mpy', 'application/vnd.ibm.minipay'],
    ['mqy', 'application/vnd.mobius.mqy'],
    ['mrc', 'application/marc'],
    ['mrcx', 'application/marcxml+xml'],
    ['ms', 'application/x-troff-ms'],
    ['mscml', 'application/mediaservercontrol+xml'],
    ['mseq', 'application/vnd.mseq'],
    ['msf', 'application/vnd.epson.msf'],
    ['msg', 'application/vnd.ms-outlook'],
    ['msh', 'model/mesh'],
    ['msl', 'application/vnd.mobius.msl'],
    ['msty', 'application/vnd.muvee.style'],
    ['mts', 'model/vnd.mts'],
    ['mus', 'application/vnd.musician'],
    ['musicxml', 'application/vnd.recordare.musicxml+xml'],
    ['mv', 'video/x-sgi-movie'],
    ['mvb', 'application/x-msmediaview'],
    ['mwf', 'application/vnd.mfer'],
    ['mxf', 'application/mxf'],
    ['mxl', 'application/vnd.recordare.musicxml'],
    ['mxml', 'application/xv+xml'],
    ['mxs', 'application/vnd.triscape.mxs'],
    ['mxu', 'video/vnd.mpegurl'],
    ['my', 'audio/make'],
    ['mzz', 'application/x-vnd.audioexplosion.mzz'],
    ['n-gage', 'application/vnd.nokia.n-gage.symbian.install'],
    ['n3', 'text/n3'],
    ['nap', 'image/naplps'],
    ['naplps', 'image/naplps'],
    ['nbp', 'application/vnd.wolfram.player'],
    ['nc', 'application/x-netcdf'],
    ['ncm', 'application/vnd.nokia.configuration-message'],
    ['ncx', 'application/x-dtbncx+xml'],
    ['ngdat', 'application/vnd.nokia.n-gage.data'],
    ['nif', 'image/x-niff'],
    ['niff', 'image/x-niff'],
    ['nix', 'application/x-mix-transfer'],
    ['nlu', 'application/vnd.neurolanguage.nlu'],
    ['nml', 'application/vnd.enliven'],
    ['nnd', 'application/vnd.noblenet-directory'],
    ['nns', 'application/vnd.noblenet-sealer'],
    ['nnw', 'application/vnd.noblenet-web'],
    ['npx', 'image/vnd.net-fpx'],
    ['nsc', 'application/x-conference'],
    ['nsf', 'application/vnd.lotus-notes'],
    ['nvd', 'application/x-navidoc'],
    ['nws', 'message/rfc822'],
    ['o', 'application/octet-stream'],
    ['oa2', 'application/vnd.fujitsu.oasys2'],
    ['oa3', 'application/vnd.fujitsu.oasys3'],
    ['oas', 'application/vnd.fujitsu.oasys'],
    ['obd', 'application/x-msbinder'],
    ['oda', 'application/oda'],
    ['odb', 'application/vnd.oasis.opendocument.database'],
    ['odc', 'application/vnd.oasis.opendocument.chart'],
    ['odf', 'application/vnd.oasis.opendocument.formula'],
    ['odft', 'application/vnd.oasis.opendocument.formula-template'],
    ['odg', 'application/vnd.oasis.opendocument.graphics'],
    ['odi', 'application/vnd.oasis.opendocument.image'],
    ['odm', 'application/vnd.oasis.opendocument.text-master'],
    ['odp', 'application/vnd.oasis.opendocument.presentation'],
    ['ods', 'application/vnd.oasis.opendocument.spreadsheet'],
    ['odt', 'application/vnd.oasis.opendocument.text'],
    ['oga', 'audio/ogg'],
    ['ogv', 'video/ogg'],
    ['ogx', 'application/ogg'],
    ['omc', 'application/x-omc'],
    ['omcd', 'application/x-omcdatamaker'],
    ['omcr', 'application/x-omcregerator'],
    ['onetoc', 'application/onenote'],
    ['opf', 'application/oebps-package+xml'],
    ['org', 'application/vnd.lotus-organizer'],
    ['osf', 'application/vnd.yamaha.openscoreformat'],
    ['osfpvg', 'application/vnd.yamaha.openscoreformat.osfpvg+xml'],
    ['otc', 'application/vnd.oasis.opendocument.chart-template'],
    ['otf', 'application/x-font-otf'],
    ['otg', 'application/vnd.oasis.opendocument.graphics-template'],
    ['oth', 'application/vnd.oasis.opendocument.text-web'],
    ['oti', 'application/vnd.oasis.opendocument.image-template'],
    ['otp', 'application/vnd.oasis.opendocument.presentation-template'],
    ['ots', 'application/vnd.oasis.opendocument.spreadsheet-template'],
    ['ott', 'application/vnd.oasis.opendocument.text-template'],
    ['oxt', 'application/vnd.openofficeorg.extension'],
    ['p', 'text/x-pascal'],
    ['p10', ['application/pkcs10', 'application/x-pkcs10']],
    ['p12', ['application/pkcs-12', 'application/x-pkcs12']],
    ['p7a', 'application/x-pkcs7-signature'],
    ['p7b', 'application/x-pkcs7-certificates'],
    ['p7c', ['application/pkcs7-mime', 'application/x-pkcs7-mime']],
    ['p7m', ['application/pkcs7-mime', 'application/x-pkcs7-mime']],
    ['p7r', 'application/x-pkcs7-certreqresp'],
    ['p7s', ['application/pkcs7-signature', 'application/x-pkcs7-signature']],
    ['p8', 'application/pkcs8'],
    ['par', 'text/plain-bas'],
    ['part', 'application/pro_eng'],
    ['pas', 'text/pascal'],
    ['paw', 'application/vnd.pawaafile'],
    ['pbd', 'application/vnd.powerbuilder6'],
    ['pbm', 'image/x-portable-bitmap'],
    ['pcf', 'application/x-font-pcf'],
    ['pcl', ['application/vnd.hp-pcl', 'application/x-pcl']],
    ['pclxl', 'application/vnd.hp-pclxl'],
    ['pct', 'image/x-pict'],
    ['pcurl', 'application/vnd.curl.pcurl'],
    ['pcx', 'image/x-pcx'],
    ['pdb', ['application/vnd.palm', 'chemical/x-pdb']],
    ['pdf', 'application/pdf'],
    ['pfa', 'application/x-font-type1'],
    ['pfr', 'application/font-tdpfr'],
    ['pfunk', ['audio/make', 'audio/make.my.funk']],
    ['pfx', 'application/x-pkcs12'],
    ['pgm', ['image/x-portable-graymap', 'image/x-portable-greymap']],
    ['pgn', 'application/x-chess-pgn'],
    ['pgp', 'application/pgp-signature'],
    ['pic', ['image/pict', 'image/x-pict']],
    ['pict', 'image/pict'],
    ['pkg', 'application/x-newton-compatible-pkg'],
    ['pki', 'application/pkixcmp'],
    ['pkipath', 'application/pkix-pkipath'],
    ['pko', ['application/ynd.ms-pkipko', 'application/vnd.ms-pki.pko']],
    ['pl', ['text/plain', 'text/x-script.perl']],
    ['plb', 'application/vnd.3gpp.pic-bw-large'],
    ['plc', 'application/vnd.mobius.plc'],
    ['plf', 'application/vnd.pocketlearn'],
    ['pls', 'application/pls+xml'],
    ['plx', 'application/x-pixclscript'],
    ['pm', ['text/x-script.perl-module', 'image/x-xpixmap']],
    ['pm4', 'application/x-pagemaker'],
    ['pm5', 'application/x-pagemaker'],
    ['pma', 'application/x-perfmon'],
    ['pmc', 'application/x-perfmon'],
    ['pml', ['application/vnd.ctc-posml', 'application/x-perfmon']],
    ['pmr', 'application/x-perfmon'],
    ['pmw', 'application/x-perfmon'],
    ['png', 'image/png'],
    ['pnm', ['application/x-portable-anymap', 'image/x-portable-anymap']],
    ['portpkg', 'application/vnd.macports.portpkg'],
    ['pot', ['application/vnd.ms-powerpoint', 'application/mspowerpoint']],
    ['potm', 'application/vnd.ms-powerpoint.template.macroenabled.12'],
    ['potx', 'application/vnd.openxmlformats-officedocument.presentationml.template'],
    ['pov', 'model/x-pov'],
    ['ppa', 'application/vnd.ms-powerpoint'],
    ['ppam', 'application/vnd.ms-powerpoint.addin.macroenabled.12'],
    ['ppd', 'application/vnd.cups-ppd'],
    ['ppm', 'image/x-portable-pixmap'],
    ['pps', ['application/vnd.ms-powerpoint', 'application/mspowerpoint']],
    ['ppsm', 'application/vnd.ms-powerpoint.slideshow.macroenabled.12'],
    ['ppsx', 'application/vnd.openxmlformats-officedocument.presentationml.slideshow'],
    ['ppt', ['application/vnd.ms-powerpoint', 'application/mspowerpoint', 'application/powerpoint', 'application/x-mspowerpoint']],
    ['pptm', 'application/vnd.ms-powerpoint.presentation.macroenabled.12'],
    ['pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    ['ppz', 'application/mspowerpoint'],
    ['prc', 'application/x-mobipocket-ebook'],
    ['pre', ['application/vnd.lotus-freelance', 'application/x-freelance']],
    ['prf', 'application/pics-rules'],
    ['prt', 'application/pro_eng'],
    ['ps', 'application/postscript'],
    ['psb', 'application/vnd.3gpp.pic-bw-small'],
    ['psd', ['application/octet-stream', 'image/vnd.adobe.photoshop']],
    ['psf', 'application/x-font-linux-psf'],
    ['pskcxml', 'application/pskc+xml'],
    ['ptid', 'application/vnd.pvi.ptid1'],
    ['pub', 'application/x-mspublisher'],
    ['pvb', 'application/vnd.3gpp.pic-bw-var'],
    ['pvu', 'paleovu/x-pv'],
    ['pwn', 'application/vnd.3m.post-it-notes'],
    ['pwz', 'application/vnd.ms-powerpoint'],
    ['py', 'text/x-script.phyton'],
    ['pya', 'audio/vnd.ms-playready.media.pya'],
    ['pyc', 'application/x-bytecode.python'],
    ['pyv', 'video/vnd.ms-playready.media.pyv'],
    ['qam', 'application/vnd.epson.quickanime'],
    ['qbo', 'application/vnd.intu.qbo'],
    ['qcp', 'audio/vnd.qcelp'],
    ['qd3', 'x-world/x-3dmf'],
    ['qd3d', 'x-world/x-3dmf'],
    ['qfx', 'application/vnd.intu.qfx'],
    ['qif', 'image/x-quicktime'],
    ['qps', 'application/vnd.publishare-delta-tree'],
    ['qt', 'video/quicktime'],
    ['qtc', 'video/x-qtc'],
    ['qti', 'image/x-quicktime'],
    ['qtif', 'image/x-quicktime'],
    ['qxd', 'application/vnd.quark.quarkxpress'],
    ['ra', ['audio/x-realaudio', 'audio/x-pn-realaudio', 'audio/x-pn-realaudio-plugin']],
    ['ram', 'audio/x-pn-realaudio'],
    ['rar', 'application/x-rar-compressed'],
    ['ras', ['image/cmu-raster', 'application/x-cmu-raster', 'image/x-cmu-raster']],
    ['rast', 'image/cmu-raster'],
    ['rcprofile', 'application/vnd.ipunplugged.rcprofile'],
    ['rdf', 'application/rdf+xml'],
    ['rdz', 'application/vnd.data-vision.rdz'],
    ['rep', 'application/vnd.businessobjects'],
    ['res', 'application/x-dtbresource+xml'],
    ['rexx', 'text/x-script.rexx'],
    ['rf', 'image/vnd.rn-realflash'],
    ['rgb', 'image/x-rgb'],
    ['rif', 'application/reginfo+xml'],
    ['rip', 'audio/vnd.rip'],
    ['rl', 'application/resource-lists+xml'],
    ['rlc', 'image/vnd.fujixerox.edmics-rlc'],
    ['rld', 'application/resource-lists-diff+xml'],
    ['rm', ['application/vnd.rn-realmedia', 'audio/x-pn-realaudio']],
    ['rmi', 'audio/mid'],
    ['rmm', 'audio/x-pn-realaudio'],
    ['rmp', ['audio/x-pn-realaudio-plugin', 'audio/x-pn-realaudio']],
    ['rms', 'application/vnd.jcp.javame.midlet-rms'],
    ['rnc', 'application/relax-ng-compact-syntax'],
    ['rng', ['application/ringing-tones', 'application/vnd.nokia.ringing-tone']],
    ['rnx', 'application/vnd.rn-realplayer'],
    ['roff', 'application/x-troff'],
    ['rp', 'image/vnd.rn-realpix'],
    ['rp9', 'application/vnd.cloanto.rp9'],
    ['rpm', 'audio/x-pn-realaudio-plugin'],
    ['rpss', 'application/vnd.nokia.radio-presets'],
    ['rpst', 'application/vnd.nokia.radio-preset'],
    ['rq', 'application/sparql-query'],
    ['rs', 'application/rls-services+xml'],
    ['rsd', 'application/rsd+xml'],
    ['rt', ['text/richtext', 'text/vnd.rn-realtext']],
    ['rtf', ['application/rtf', 'text/richtext', 'application/x-rtf']],
    ['rtx', ['text/richtext', 'application/rtf']],
    ['rv', 'video/vnd.rn-realvideo'],
    ['s', 'text/x-asm'],
    ['s3m', 'audio/s3m'],
    ['saf', 'application/vnd.yamaha.smaf-audio'],
    ['saveme', 'application/octet-stream'],
    ['sbk', 'application/x-tbook'],
    ['sbml', 'application/sbml+xml'],
    ['sc', 'application/vnd.ibm.secure-container'],
    ['scd', 'application/x-msschedule'],
    [
        'scm',
        ['application/vnd.lotus-screencam', 'video/x-scm', 'text/x-script.guile', 'application/x-lotusscreencam', 'text/x-script.scheme']
    ],
    ['scq', 'application/scvp-cv-request'],
    ['scs', 'application/scvp-cv-response'],
    ['sct', 'text/scriptlet'],
    ['scurl', 'text/vnd.curl.scurl'],
    ['sda', 'application/vnd.stardivision.draw'],
    ['sdc', 'application/vnd.stardivision.calc'],
    ['sdd', 'application/vnd.stardivision.impress'],
    ['sdkm', 'application/vnd.solent.sdkm+xml'],
    ['sdml', 'text/plain'],
    ['sdp', ['application/sdp', 'application/x-sdp']],
    ['sdr', 'application/sounder'],
    ['sdw', 'application/vnd.stardivision.writer'],
    ['sea', ['application/sea', 'application/x-sea']],
    ['see', 'application/vnd.seemail'],
    ['seed', 'application/vnd.fdsn.seed'],
    ['sema', 'application/vnd.sema'],
    ['semd', 'application/vnd.semd'],
    ['semf', 'application/vnd.semf'],
    ['ser', 'application/java-serialized-object'],
    ['set', 'application/set'],
    ['setpay', 'application/set-payment-initiation'],
    ['setreg', 'application/set-registration-initiation'],
    ['sfd-hdstx', 'application/vnd.hydrostatix.sof-data'],
    ['sfs', 'application/vnd.spotfire.sfs'],
    ['sgl', 'application/vnd.stardivision.writer-global'],
    ['sgm', ['text/sgml', 'text/x-sgml']],
    ['sgml', ['text/sgml', 'text/x-sgml']],
    ['sh', ['application/x-shar', 'application/x-bsh', 'application/x-sh', 'text/x-script.sh']],
    ['shar', ['application/x-bsh', 'application/x-shar']],
    ['shf', 'application/shf+xml'],
    ['shtml', ['text/html', 'text/x-server-parsed-html']],
    ['sid', 'audio/x-psid'],
    ['sis', 'application/vnd.symbian.install'],
    ['sit', ['application/x-stuffit', 'application/x-sit']],
    ['sitx', 'application/x-stuffitx'],
    ['skd', 'application/x-koan'],
    ['skm', 'application/x-koan'],
    ['skp', ['application/vnd.koan', 'application/x-koan']],
    ['skt', 'application/x-koan'],
    ['sl', 'application/x-seelogo'],
    ['sldm', 'application/vnd.ms-powerpoint.slide.macroenabled.12'],
    ['sldx', 'application/vnd.openxmlformats-officedocument.presentationml.slide'],
    ['slt', 'application/vnd.epson.salt'],
    ['sm', 'application/vnd.stepmania.stepchart'],
    ['smf', 'application/vnd.stardivision.math'],
    ['smi', ['application/smil', 'application/smil+xml']],
    ['smil', 'application/smil'],
    ['snd', ['audio/basic', 'audio/x-adpcm']],
    ['snf', 'application/x-font-snf'],
    ['sol', 'application/solids'],
    ['spc', ['text/x-speech', 'application/x-pkcs7-certificates']],
    ['spf', 'application/vnd.yamaha.smaf-phrase'],
    ['spl', ['application/futuresplash', 'application/x-futuresplash']],
    ['spot', 'text/vnd.in3d.spot'],
    ['spp', 'application/scvp-vp-response'],
    ['spq', 'application/scvp-vp-request'],
    ['spr', 'application/x-sprite'],
    ['sprite', 'application/x-sprite'],
    ['src', 'application/x-wais-source'],
    ['sru', 'application/sru+xml'],
    ['srx', 'application/sparql-results+xml'],
    ['sse', 'application/vnd.kodak-descriptor'],
    ['ssf', 'application/vnd.epson.ssf'],
    ['ssi', 'text/x-server-parsed-html'],
    ['ssm', 'application/streamingmedia'],
    ['ssml', 'application/ssml+xml'],
    ['sst', ['application/vnd.ms-pkicertstore', 'application/vnd.ms-pki.certstore']],
    ['st', 'application/vnd.sailingtracker.track'],
    ['stc', 'application/vnd.sun.xml.calc.template'],
    ['std', 'application/vnd.sun.xml.draw.template'],
    ['step', 'application/step'],
    ['stf', 'application/vnd.wt.stf'],
    ['sti', 'application/vnd.sun.xml.impress.template'],
    ['stk', 'application/hyperstudio'],
    ['stl', ['application/vnd.ms-pkistl', 'application/sla', 'application/vnd.ms-pki.stl', 'application/x-navistyle']],
    ['stm', 'text/html'],
    ['stp', 'application/step'],
    ['str', 'application/vnd.pg.format'],
    ['stw', 'application/vnd.sun.xml.writer.template'],
    ['sub', 'image/vnd.dvb.subtitle'],
    ['sus', 'application/vnd.sus-calendar'],
    ['sv4cpio', 'application/x-sv4cpio'],
    ['sv4crc', 'application/x-sv4crc'],
    ['svc', 'application/vnd.dvb.service'],
    ['svd', 'application/vnd.svd'],
    ['svf', ['image/vnd.dwg', 'image/x-dwg']],
    ['svg', 'image/svg+xml'],
    ['svr', ['x-world/x-svr', 'application/x-world']],
    ['swf', 'application/x-shockwave-flash'],
    ['swi', 'application/vnd.aristanetworks.swi'],
    ['sxc', 'application/vnd.sun.xml.calc'],
    ['sxd', 'application/vnd.sun.xml.draw'],
    ['sxg', 'application/vnd.sun.xml.writer.global'],
    ['sxi', 'application/vnd.sun.xml.impress'],
    ['sxm', 'application/vnd.sun.xml.math'],
    ['sxw', 'application/vnd.sun.xml.writer'],
    ['t', ['text/troff', 'application/x-troff']],
    ['talk', 'text/x-speech'],
    ['tao', 'application/vnd.tao.intent-module-archive'],
    ['tar', 'application/x-tar'],
    ['tbk', ['application/toolbook', 'application/x-tbook']],
    ['tcap', 'application/vnd.3gpp2.tcap'],
    ['tcl', ['text/x-script.tcl', 'application/x-tcl']],
    ['tcsh', 'text/x-script.tcsh'],
    ['teacher', 'application/vnd.smart.teacher'],
    ['tei', 'application/tei+xml'],
    ['tex', 'application/x-tex'],
    ['texi', 'application/x-texinfo'],
    ['texinfo', 'application/x-texinfo'],
    ['text', ['application/plain', 'text/plain']],
    ['tfi', 'application/thraud+xml'],
    ['tfm', 'application/x-tex-tfm'],
    ['tgz', ['application/gnutar', 'application/x-compressed']],
    ['thmx', 'application/vnd.ms-officetheme'],
    ['tif', ['image/tiff', 'image/x-tiff']],
    ['tiff', ['image/tiff', 'image/x-tiff']],
    ['tmo', 'application/vnd.tmobile-livetv'],
    ['torrent', 'application/x-bittorrent'],
    ['tpl', 'application/vnd.groove-tool-template'],
    ['tpt', 'application/vnd.trid.tpt'],
    ['tr', 'application/x-troff'],
    ['tra', 'application/vnd.trueapp'],
    ['trm', 'application/x-msterminal'],
    ['tsd', 'application/timestamped-data'],
    ['tsi', 'audio/tsp-audio'],
    ['tsp', ['application/dsptype', 'audio/tsplayer']],
    ['tsv', 'text/tab-separated-values'],
    ['ttf', 'application/x-font-ttf'],
    ['ttl', 'text/turtle'],
    ['turbot', 'image/florian'],
    ['twd', 'application/vnd.simtech-mindmapper'],
    ['txd', 'application/vnd.genomatix.tuxedo'],
    ['txf', 'application/vnd.mobius.txf'],
    ['txt', 'text/plain'],
    ['ufd', 'application/vnd.ufdl'],
    ['uil', 'text/x-uil'],
    ['uls', 'text/iuls'],
    ['umj', 'application/vnd.umajin'],
    ['uni', 'text/uri-list'],
    ['unis', 'text/uri-list'],
    ['unityweb', 'application/vnd.unity'],
    ['unv', 'application/i-deas'],
    ['uoml', 'application/vnd.uoml+xml'],
    ['uri', 'text/uri-list'],
    ['uris', 'text/uri-list'],
    ['ustar', ['application/x-ustar', 'multipart/x-ustar']],
    ['utz', 'application/vnd.uiq.theme'],
    ['uu', ['application/octet-stream', 'text/x-uuencode']],
    ['uue', 'text/x-uuencode'],
    ['uva', 'audio/vnd.dece.audio'],
    ['uvh', 'video/vnd.dece.hd'],
    ['uvi', 'image/vnd.dece.graphic'],
    ['uvm', 'video/vnd.dece.mobile'],
    ['uvp', 'video/vnd.dece.pd'],
    ['uvs', 'video/vnd.dece.sd'],
    ['uvu', 'video/vnd.uvvu.mp4'],
    ['uvv', 'video/vnd.dece.video'],
    ['vcd', 'application/x-cdlink'],
    ['vcf', 'text/x-vcard'],
    ['vcg', 'application/vnd.groove-vcard'],
    ['vcs', 'text/x-vcalendar'],
    ['vcx', 'application/vnd.vcx'],
    ['vda', 'application/vda'],
    ['vdo', 'video/vdo'],
    ['vew', 'application/groupwise'],
    ['vis', 'application/vnd.visionary'],
    ['viv', ['video/vivo', 'video/vnd.vivo']],
    ['vivo', ['video/vivo', 'video/vnd.vivo']],
    ['vmd', 'application/vocaltec-media-desc'],
    ['vmf', 'application/vocaltec-media-file'],
    ['voc', ['audio/voc', 'audio/x-voc']],
    ['vos', 'video/vosaic'],
    ['vox', 'audio/voxware'],
    ['vqe', 'audio/x-twinvq-plugin'],
    ['vqf', 'audio/x-twinvq'],
    ['vql', 'audio/x-twinvq-plugin'],
    ['vrml', ['model/vrml', 'x-world/x-vrml', 'application/x-vrml']],
    ['vrt', 'x-world/x-vrt'],
    ['vsd', ['application/vnd.visio', 'application/x-visio']],
    ['vsf', 'application/vnd.vsf'],
    ['vst', 'application/x-visio'],
    ['vsw', 'application/x-visio'],
    ['vtu', 'model/vnd.vtu'],
    ['vxml', 'application/voicexml+xml'],
    ['w60', 'application/wordperfect6.0'],
    ['w61', 'application/wordperfect6.1'],
    ['w6w', 'application/msword'],
    ['wad', 'application/x-doom'],
    ['wav', ['audio/wav', 'audio/x-wav']],
    ['wax', 'audio/x-ms-wax'],
    ['wb1', 'application/x-qpro'],
    ['wbmp', 'image/vnd.wap.wbmp'],
    ['wbs', 'application/vnd.criticaltools.wbs+xml'],
    ['wbxml', 'application/vnd.wap.wbxml'],
    ['wcm', 'application/vnd.ms-works'],
    ['wdb', 'application/vnd.ms-works'],
    ['web', 'application/vnd.xara'],
    ['weba', 'audio/webm'],
    ['webm', 'video/webm'],
    ['webp', 'image/webp'],
    ['wg', 'application/vnd.pmi.widget'],
    ['wgt', 'application/widget'],
    ['wiz', 'application/msword'],
    ['wk1', 'application/x-123'],
    ['wks', 'application/vnd.ms-works'],
    ['wm', 'video/x-ms-wm'],
    ['wma', 'audio/x-ms-wma'],
    ['wmd', 'application/x-ms-wmd'],
    ['wmf', ['windows/metafile', 'application/x-msmetafile']],
    ['wml', 'text/vnd.wap.wml'],
    ['wmlc', 'application/vnd.wap.wmlc'],
    ['wmls', 'text/vnd.wap.wmlscript'],
    ['wmlsc', 'application/vnd.wap.wmlscriptc'],
    ['wmv', 'video/x-ms-wmv'],
    ['wmx', 'video/x-ms-wmx'],
    ['wmz', 'application/x-ms-wmz'],
    ['woff', 'application/x-font-woff'],
    ['word', 'application/msword'],
    ['wp', 'application/wordperfect'],
    ['wp5', ['application/wordperfect', 'application/wordperfect6.0']],
    ['wp6', 'application/wordperfect'],
    ['wpd', ['application/wordperfect', 'application/vnd.wordperfect', 'application/x-wpwin']],
    ['wpl', 'application/vnd.ms-wpl'],
    ['wps', 'application/vnd.ms-works'],
    ['wq1', 'application/x-lotus'],
    ['wqd', 'application/vnd.wqd'],
    ['wri', ['application/mswrite', 'application/x-wri', 'application/x-mswrite']],
    ['wrl', ['model/vrml', 'x-world/x-vrml', 'application/x-world']],
    ['wrz', ['model/vrml', 'x-world/x-vrml']],
    ['wsc', 'text/scriplet'],
    ['wsdl', 'application/wsdl+xml'],
    ['wspolicy', 'application/wspolicy+xml'],
    ['wsrc', 'application/x-wais-source'],
    ['wtb', 'application/vnd.webturbo'],
    ['wtk', 'application/x-wintalk'],
    ['wvx', 'video/x-ms-wvx'],
    ['x-png', 'image/png'],
    ['x3d', 'application/vnd.hzn-3d-crossword'],
    ['xaf', 'x-world/x-vrml'],
    ['xap', 'application/x-silverlight-app'],
    ['xar', 'application/vnd.xara'],
    ['xbap', 'application/x-ms-xbap'],
    ['xbd', 'application/vnd.fujixerox.docuworks.binder'],
    ['xbm', ['image/xbm', 'image/x-xbm', 'image/x-xbitmap']],
    ['xdf', 'application/xcap-diff+xml'],
    ['xdm', 'application/vnd.syncml.dm+xml'],
    ['xdp', 'application/vnd.adobe.xdp+xml'],
    ['xdr', 'video/x-amt-demorun'],
    ['xdssc', 'application/dssc+xml'],
    ['xdw', 'application/vnd.fujixerox.docuworks'],
    ['xenc', 'application/xenc+xml'],
    ['xer', 'application/patch-ops-error+xml'],
    ['xfdf', 'application/vnd.adobe.xfdf'],
    ['xfdl', 'application/vnd.xfdl'],
    ['xgz', 'xgl/drawing'],
    ['xhtml', 'application/xhtml+xml'],
    ['xif', 'image/vnd.xiff'],
    ['xl', 'application/excel'],
    ['xla', ['application/vnd.ms-excel', 'application/excel', 'application/x-msexcel', 'application/x-excel']],
    ['xlam', 'application/vnd.ms-excel.addin.macroenabled.12'],
    ['xlb', ['application/excel', 'application/vnd.ms-excel', 'application/x-excel']],
    ['xlc', ['application/vnd.ms-excel', 'application/excel', 'application/x-excel']],
    ['xld', ['application/excel', 'application/x-excel']],
    ['xlk', ['application/excel', 'application/x-excel']],
    ['xll', ['application/excel', 'application/vnd.ms-excel', 'application/x-excel']],
    ['xlm', ['application/vnd.ms-excel', 'application/excel', 'application/x-excel']],
    ['xls', ['application/vnd.ms-excel', 'application/excel', 'application/x-msexcel', 'application/x-excel']],
    ['xlsb', 'application/vnd.ms-excel.sheet.binary.macroenabled.12'],
    ['xlsm', 'application/vnd.ms-excel.sheet.macroenabled.12'],
    ['xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    ['xlt', ['application/vnd.ms-excel', 'application/excel', 'application/x-excel']],
    ['xltm', 'application/vnd.ms-excel.template.macroenabled.12'],
    ['xltx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.template'],
    ['xlv', ['application/excel', 'application/x-excel']],
    ['xlw', ['application/vnd.ms-excel', 'application/excel', 'application/x-msexcel', 'application/x-excel']],
    ['xm', 'audio/xm'],
    ['xml', ['application/xml', 'text/xml', 'application/atom+xml', 'application/rss+xml']],
    ['xmz', 'xgl/movie'],
    ['xo', 'application/vnd.olpc-sugar'],
    ['xof', 'x-world/x-vrml'],
    ['xop', 'application/xop+xml'],
    ['xpi', 'application/x-xpinstall'],
    ['xpix', 'application/x-vnd.ls-xpix'],
    ['xpm', ['image/xpm', 'image/x-xpixmap']],
    ['xpr', 'application/vnd.is-xpr'],
    ['xps', 'application/vnd.ms-xpsdocument'],
    ['xpw', 'application/vnd.intercon.formnet'],
    ['xslt', 'application/xslt+xml'],
    ['xsm', 'application/vnd.syncml+xml'],
    ['xspf', 'application/xspf+xml'],
    ['xsr', 'video/x-amt-showrun'],
    ['xul', 'application/vnd.mozilla.xul+xml'],
    ['xwd', ['image/x-xwd', 'image/x-xwindowdump']],
    ['xyz', ['chemical/x-xyz', 'chemical/x-pdb']],
    ['yang', 'application/yang'],
    ['yin', 'application/yin+xml'],
    ['z', ['application/x-compressed', 'application/x-compress']],
    ['zaz', 'application/vnd.zzazz.deck+xml'],
    ['zip', ['application/zip', 'multipart/x-zip', 'application/x-zip-compressed', 'application/x-compressed']],
    ['zir', 'application/vnd.zul'],
    ['zmm', 'application/vnd.handheld-entertainment+xml'],
    ['zoo', 'application/octet-stream'],
    ['zsh', 'text/x-script.zsh']
]);
function detectMimeType(filename) {
    if (!filename) {
        return defaultMimeType;
    }
    const parsed = node_path_1.default.parse(filename);
    const extension = (parsed.ext.substr(1) || parsed.name || '').split('?').shift().trim().toLowerCase();
    const value = extensions.has(extension) ? extensions.get(extension) : defaultMimeType;
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
}
function detectExtension(mimeType) {
    if (!mimeType) {
        return defaultExtension;
    }
    const parts = mimeType.toLowerCase().trim().split('/');
    const rootType = parts.shift().trim();
    const subType = parts.join('/').trim();
    if (mimeTypes.has(rootType + '/' + subType)) {
        const value = mimeTypes.get(rootType + '/' + subType);
        if (Array.isArray(value)) {
            return value[0];
        }
        return value;
    }
    switch (rootType) {
        case 'text':
            return 'txt';
        default:
            return 'bin';
    }
}


/***/ }),

/***/ 1915:
/***/ (function(module, exports, __nccwpck_require__) {


/* eslint no-undefined: 0, prefer-spread: 0, no-control-regex: 0 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const node_crypto_1 = __importDefault(__nccwpck_require__(7598));
const node_fs_1 = __importDefault(__nccwpck_require__(3024));
const punycode = __importStar(__nccwpck_require__(111));
const node_stream_1 = __nccwpck_require__(7075);
const shared = __importStar(__nccwpck_require__(9893));
const node_url_1 = __importDefault(__nccwpck_require__(3136));
const mimeFuncs = __importStar(__nccwpck_require__(1038));
const qp = __importStar(__nccwpck_require__(7529));
const base64 = __importStar(__nccwpck_require__(4059));
const index_js_1 = __importDefault(__nccwpck_require__(2315));
const index_js_2 = __importDefault(__nccwpck_require__(7336));
const errors = __importStar(__nccwpck_require__(932));
const last_newline_js_1 = __importDefault(__nccwpck_require__(2486));
const le_windows_js_1 = __importDefault(__nccwpck_require__(7636));
const le_unix_js_1 = __importDefault(__nccwpck_require__(8367));
const FORMATTED_HEADERS = ['From', 'Sender', 'To', 'Cc', 'Bcc', 'Reply-To', 'Date', 'References'];
// RFC 5321 atext, plus the non-ascii bytes that SMTPUTF8 (RFC 6531) adds to it. A local part
// built from these, with '.' as a separator, is a dot-atom and can be emitted bare
const ATEXT = "[A-Za-z0-9!#$%&'*+\\-/=?^_`{|}~\\x80-\\uFFFF]";
const DOT_ATOM = new RegExp('^' + ATEXT + '+(?:\\.' + ATEXT + '+)*$');
// A complete quoted-string: everything between the outer quotes is either a plain char or
// a quoted-pair. Anchored, so a value that only starts and ends with a quote does not pass
const QUOTED_STRING = /^"(?:[^"\\]|\\[\s\S])*"$/;
// An address that carries no special anywhere can be emitted bare in a header, everything
// else goes into angle brackets so that the header can not be read as more addresses than
// the envelope carries
const PLAIN_ADDRESS = /^[^\s"(),:;<>@[\\\]]+@[^\s"(),:;<>@[\\\]]+$/;
// domainToASCII and domainToUnicode are WHATWG host parsers rather than plain IDNA
// mappers, so they do more than map: they cut the host at '/', '\\', '?' and '#', drop C0
// controls, and percent-decode. Handing them 'evil.example/mail.corp.example' returns the
// deliverable 'evil.example', which would turn a value the bundled codec leaves as
// unroutable garbage into mail for a domain the sender never named. None of these
// characters are legal in a domain, so keep them away from the mapper.
const URL_PARSER_UNSAFE = /[/\\?#%\x00-\x20\x7F]/;
/**
 * Encodes a domain the way browsers, the WHATWG URL Standard and DNS facing resolvers do,
 * which is with UTS-46 mapping applied before the Punycode step.
 *
 * The bundled codec is plain RFC 3492 and maps nothing, so it disagrees with every
 * conformant parser on any domain holding a mapped or ignored code point. An invisible
 * U+00AD in 'compa\u00ADny.com' encoded to 'xn--company-pka.com' where a validator reads
 * 'company.com', which let an allow-listed domain be checked and a different one mailed.
 *
 * Anything the URL parser does not accept as a hostname, an address literal such as
 * '[127.0.0.1]' included, comes back empty and falls through to the bundled codec, which
 * leaves those as they were supplied.
 *
 * @param domain Domain to encode, already lowercased by the caller
 * @param toUnicode Return the U-label form instead of the A-label form
 * @return Encoded domain
 */
function normalizeDomain(domain, toUnicode) {
    // domainToASCII and domainToUnicode landed in Node 7, the bundled codec covers Node 6
    const mapper = toUnicode ? node_url_1.default.domainToUnicode : node_url_1.default.domainToASCII;
    if (typeof mapper === 'function' && !URL_PARSER_UNSAFE.test(domain)) {
        const mapped = mapper(domain);
        if (mapped) {
            return mapped;
        }
    }
    return toUnicode ? punycode.toUnicode(domain) : punycode.toASCII(domain);
}
/**
 * Creates a new mime tree node. Assumes 'multipart/*' as the content type
 * if it is a branch, anything else counts as leaf. If rootNode is missing from
 * the options, assumes this is the root.
 *
 * @param contentType Define the content type for the node. Can be left blank for attachments (derived from filename)
 * @param [options] optional options
 * @param [options.rootNode] root node for this tree
 * @param [options.parentNode] immediate parent for this node
 * @param [options.filename] filename for an attachment node
 * @param [options.baseBoundary] shared part of the unique multipart boundary
 * @param [options.keepBcc] If true, do not exclude Bcc from the generated headers
 * @param [options.normalizeHeaderKey] method to normalize header keys for custom caseing
 * @param [options.textEncoding] either 'Q' (the default) or 'B'
 */
class MimeNode {
    constructor(contentType, options) {
        this.nodeCounter = 0;
        options = options || {};
        /**
         * shared part of the unique multipart boundary
         */
        this.baseBoundary = options.baseBoundary || node_crypto_1.default.randomBytes(8).toString('hex');
        this.boundaryPrefix = options.boundaryPrefix || '--_NmP';
        this.disableFileAccess = !!options.disableFileAccess;
        this.disableUrlAccess = !!options.disableUrlAccess;
        this.normalizeHeaderKey = options.normalizeHeaderKey;
        /**
         * If date headers is missing and current node is the root, this value is used instead
         */
        this.date = options.parentNode ? null : new Date();
        /**
         * Root node for current mime tree
         */
        this.rootNode = options.rootNode || this;
        /**
         * If true include Bcc in generated headers (if available)
         */
        this.keepBcc = !!options.keepBcc;
        /**
         * If filename is specified but contentType is not (probably an attachment)
         * detect the content type from filename extension
         */
        if (options.filename) {
            /**
             * Filename for this node. Useful with attachments
             */
            this.filename = options.filename;
            if (!contentType) {
                contentType = mimeFuncs.detectMimeType(this.filename.split('.').pop());
            }
        }
        /**
         * Indicates which encoding should be used for header strings: "Q" or "B"
         */
        this.textEncoding = (options.textEncoding || '').toString().trim().charAt(0).toUpperCase();
        /**
         * Immediate parent for this node (or undefined if not set)
         */
        this.parentNode = options.parentNode;
        /**
         * Hostname for default message-id values
         */
        this.hostname = options.hostname;
        /**
         * If set to 'win' then uses \r\n, if 'linux' then \n. If not set (or `raw` is used) then newlines are kept as is.
         */
        this.newline = options.newline;
        /**
         * An array for possible child nodes
         */
        this.childNodes = [];
        /**
         * Used for generating unique boundaries (prepended to the shared base)
         */
        this._nodeId = ++this.rootNode.nodeCounter;
        /**
         * A list of header values for this node in the form of [{key:'', value:''}]
         */
        this._headers = [];
        /**
         * True if the content only uses ASCII printable characters
         * @type {Boolean}
         */
        this._isPlainText = false;
        /**
         * True if the content is plain text but has longer lines than allowed
         * @type {Boolean}
         */
        this._hasLongLines = false;
        /**
         * If set, use instead this value for envelopes instead of generating one
         * @type {Boolean}
         */
        this._envelope = false;
        /**
         * If set then use this value as the stream content instead of building it
         * @type {String|Buffer|Stream}
         */
        this._raw = false;
        /**
         * Additional transform streams that the message will be piped before
         * exposing by createReadStream
         * @type {Array}
         */
        this._transforms = [];
        /**
         * Additional process functions that the message will be piped through before
         * exposing by createReadStream. These functions are run after transforms
         * @type {Array}
         */
        this._processFuncs = [];
        /**
         * If content type is set (or derived from the filename) add it to headers
         */
        if (contentType) {
            this.setHeader('Content-Type', contentType);
        }
    }
    /////// PUBLIC METHODS
    /**
     * Creates and appends a child node.Arguments provided are passed to MimeNode constructor
     *
     * @param [contentType] Optional content type
     * @param [options] Optional options object
     * @return Created node object
     */
    createChild(contentType, options) {
        if (!options && typeof contentType === 'object') {
            options = contentType;
            contentType = undefined;
        }
        const node = new MimeNode(contentType, options);
        this.appendChild(node);
        return node;
    }
    /**
     * Appends an existing node to the mime tree. Removes the node from an existing
     * tree if needed
     *
     * @param childNode node to be appended
     * @return Appended node object
     */
    appendChild(childNode) {
        // Take the node out of the tree it is in first. Leaving it there keeps it in that
        // parent's childNodes, so it still streams as part of the old tree while parentNode
        // already points at the new one, and anything read off the parent chain answers for
        // the wrong tree.
        if (childNode.parentNode && childNode.parentNode !== this) {
            childNode.remove();
        }
        if (childNode.rootNode !== this.rootNode) {
            childNode.rootNode = this.rootNode;
            childNode._nodeId = ++this.rootNode.nodeCounter;
        }
        childNode.parentNode = this;
        this.childNodes.push(childNode);
        return childNode;
    }
    /**
     * Replaces current node with another node
     *
     * @param node Replacement node
     * @return Replacement node
     */
    replace(node) {
        if (node === this) {
            return this;
        }
        this.parentNode.childNodes.forEach((childNode, i) => {
            if (childNode === this) {
                node.rootNode = this.rootNode;
                node.parentNode = this.parentNode;
                node._nodeId = this._nodeId;
                this.rootNode = this;
                this.parentNode = undefined;
                node.parentNode.childNodes[i] = node;
            }
        });
        return node;
    }
    /**
     * Removes current node from the mime tree
     *
     * @return removed node
     */
    remove() {
        if (!this.parentNode) {
            return this;
        }
        for (let i = this.parentNode.childNodes.length - 1; i >= 0; i--) {
            if (this.parentNode.childNodes[i] === this) {
                this.parentNode.childNodes.splice(i, 1);
                this.parentNode = undefined;
                this.rootNode = this;
                return this;
            }
        }
    }
    /**
     * Sets a header value. If the value for selected key exists, it is overwritten.
     * You can set multiple values as well by using [{key:'', value:''}] or
     * {key: 'value'} as the first argument.
     *
     * @param key Header key or a list of key value pairs
     * @param value Header value
     * @return current node
     */
    setHeader(key, value) {
        let added = false;
        // Allow setting multiple headers at once
        if (!value && key && typeof key === 'object') {
            // allow {key:'content-type', value: 'text/plain'}
            if (key.key && 'value' in key) {
                this.setHeader(key.key, key.value);
            }
            else if (Array.isArray(key)) {
                // allow [{key:'content-type', value: 'text/plain'}]
                key.forEach(i => {
                    this.setHeader(i.key, i.value);
                });
            }
            else {
                // allow {'content-type': 'text/plain'}
                Object.keys(key).forEach(i => {
                    this.setHeader(i, key[i]);
                });
            }
            return this;
        }
        key = this._normalizeHeaderKey(key);
        const headerValue = {
            key,
            value
        };
        // Check if the value exists and overwrite
        for (let i = 0, len = this._headers.length; i < len; i++) {
            if (this._headers[i].key === key) {
                if (!added) {
                    // replace the first match
                    this._headers[i] = headerValue;
                    added = true;
                }
                else {
                    // remove following matches
                    this._headers.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
        // match not found, append the value
        if (!added) {
            this._headers.push(headerValue);
        }
        return this;
    }
    /**
     * Adds a header value. If the value for selected key exists, the value is appended
     * as a new field and old one is not touched.
     * You can set multiple values as well by using [{key:'', value:''}] or
     * {key: 'value'} as the first argument.
     *
     * @param key Header key or a list of key value pairs
     * @param value Header value
     * @return current node
     */
    addHeader(key, value) {
        // Allow setting multiple headers at once
        if (!value && key && typeof key === 'object') {
            // allow {key:'content-type', value: 'text/plain'}
            if (key.key && key.value) {
                this.addHeader(key.key, key.value);
            }
            else if (Array.isArray(key)) {
                // allow [{key:'content-type', value: 'text/plain'}]
                key.forEach(i => {
                    this.addHeader(i.key, i.value);
                });
            }
            else {
                // allow {'content-type': 'text/plain'}
                Object.keys(key).forEach(i => {
                    this.addHeader(i, key[i]);
                });
            }
            return this;
        }
        else if (Array.isArray(value)) {
            value.forEach(val => {
                this.addHeader(key, val);
            });
            return this;
        }
        this._headers.push({
            key: this._normalizeHeaderKey(key),
            value
        });
        return this;
    }
    /**
     * Retrieves the first mathcing value of a selected key
     *
     * @param key Key to search for
     * @retun Value for the key
     */
    getHeader(key) {
        key = this._normalizeHeaderKey(key);
        for (let i = 0, len = this._headers.length; i < len; i++) {
            if (this._headers[i].key === key) {
                return this._headers[i].value;
            }
        }
    }
    /**
     * Sets body content for current node. If the value is a string, charset is added automatically
     * to Content-Type (if it is text/*). If the value is a Buffer, you need to specify
     * the charset yourself
     *
     * @param content Body content
     * @return current node
     */
    setContent(content) {
        this.content = content;
        if (typeof this.content.pipe === 'function') {
            // pre-stream handler. might be triggered if a stream is set as content
            // and 'error' fires before anything is done with this stream
            this._contentErrorHandler = err => {
                this.content.removeListener('error', this._contentErrorHandler);
                this.content = err;
            };
            this.content.once('error', this._contentErrorHandler);
        }
        else if (typeof this.content === 'string') {
            this._isPlainText = mimeFuncs.isPlainText(this.content);
            if (this._isPlainText && mimeFuncs.hasLongerLines(this.content, 76)) {
                // If there are lines longer than 76 symbols/bytes do not use 7bit
                this._hasLongLines = true;
            }
        }
        return this;
    }
    build(callback) {
        let promise;
        if (!callback) {
            promise = new Promise((resolve, reject) => {
                callback = shared.callbackPromise(resolve, reject);
            });
        }
        const done = callback;
        const stream = this.createReadStream();
        const buf = [];
        let buflen = 0;
        let returned = false;
        stream.on('readable', () => {
            let chunk;
            while ((chunk = stream.read()) !== null) {
                buf.push(chunk);
                buflen += chunk.length;
            }
        });
        stream.once('error', err => {
            if (returned) {
                return;
            }
            returned = true;
            return done(err);
        });
        stream.once('end', (chunk) => {
            if (returned) {
                return;
            }
            returned = true;
            if (chunk && chunk.length) {
                buf.push(chunk);
                buflen += chunk.length;
            }
            return done(null, Buffer.concat(buf, buflen));
        });
        return promise;
    }
    getTransferEncoding() {
        let transferEncoding = false;
        const contentType = (this.getHeader('Content-Type') || '').toString().toLowerCase().trim();
        if (this.content) {
            transferEncoding = (this.getHeader('Content-Transfer-Encoding') || '').toString().toLowerCase().trim();
            if (!transferEncoding || !['base64', 'quoted-printable'].includes(transferEncoding)) {
                if (/^text\//i.test(contentType)) {
                    // If there are no special symbols, no need to modify the text
                    if (this._isPlainText && !this._hasLongLines) {
                        transferEncoding = '7bit';
                    }
                    else if (typeof this.content === 'string' || this.content instanceof Buffer) {
                        // detect preferred encoding for string value
                        transferEncoding = this._getTextEncoding(this.content) === 'Q' ? 'quoted-printable' : 'base64';
                    }
                    else {
                        // we can not check content for a stream, so either use preferred encoding or fallback to QP
                        transferEncoding = this.textEncoding === 'B' ? 'base64' : 'quoted-printable';
                    }
                }
                else if (!/^(multipart|message)\//i.test(contentType)) {
                    transferEncoding = transferEncoding || 'base64';
                }
            }
        }
        return transferEncoding;
    }
    /**
     * Builds the header block for the mime node. Append \r\n\r\n before writing the content
     *
     * @returns Headers
     */
    buildHeaders() {
        const transferEncoding = this.getTransferEncoding();
        const headers = [];
        if (transferEncoding) {
            this.setHeader('Content-Transfer-Encoding', transferEncoding);
        }
        if (this.filename && !this.getHeader('Content-Disposition')) {
            this.setHeader('Content-Disposition', 'attachment');
        }
        // Ensure mandatory header fields
        if (this.rootNode === this) {
            if (!this.getHeader('Date')) {
                this.setHeader('Date', this.date.toUTCString().replace(/GMT/, '+0000'));
            }
            // ensure that Message-Id is present
            this.messageId();
            if (!this.getHeader('MIME-Version')) {
                this.setHeader('MIME-Version', '1.0');
            }
            // Ensure that Content-Type is the last header for the root node
            for (let i = this._headers.length - 2; i >= 0; i--) {
                const header = this._headers[i];
                if (header.key === 'Content-Type') {
                    this._headers.splice(i, 1);
                    this._headers.push(header);
                }
            }
        }
        this._headers.forEach(header => {
            let key = header.key;
            let value = header.value;
            let structured;
            let param;
            const options = {};
            const formattedHeaders = FORMATTED_HEADERS;
            if (value && typeof value === 'object' && !formattedHeaders.includes(key)) {
                // the keys come from a caller supplied header object and `options.prepared`
                // below decides whether the value is emitted raw, so an own "__proto__" key
                // here would turn an unfolded value into header injection
                shared.copyOwnKeys(options, value, optionKey => optionKey === 'value');
                value = (value.value || '').toString();
                if (!value.trim()) {
                    return;
                }
            }
            if (options.prepared) {
                // header value is
                if (options.foldLines) {
                    headers.push(mimeFuncs.foldLines(key + ': ' + value));
                }
                else {
                    headers.push(key + ': ' + value);
                }
                return;
            }
            switch (header.key) {
                case 'Content-Disposition':
                    structured = mimeFuncs.parseHeaderValue(value);
                    if (this.filename) {
                        structured.params.filename = this.filename;
                    }
                    value = mimeFuncs.buildHeaderValue(structured);
                    break;
                case 'Content-Type':
                    structured = mimeFuncs.parseHeaderValue(value);
                    // the type token decides multipart and charset below, so clean it before
                    // those run and not just on the way out, otherwise a control char makes
                    // the checks miss and the header ends up claiming a type it is not set up for
                    structured.value = (structured.value || '').toString().replace(/[\x00-\x1f\x7f]/g, '');
                    this._handleContentType(structured);
                    if (structured.value.match(/^text\/plain\b/) &&
                        typeof this.content === 'string' &&
                        /[\u0080-\uFFFF]/.test(this.content)) {
                        structured.params.charset = 'utf-8';
                    }
                    value = mimeFuncs.buildHeaderValue(structured);
                    if (this.filename) {
                        // add support for non-compliant clients like QQ webmail
                        // we can't build the value with buildHeaderValue as the value is non standard and
                        // would be converted to parameter continuation encoding that we do not want
                        // control chars can not be quoted here: HT is a fold point that unfolding would
                        // turn into a space, CR/LF can not appear in a header at all and DEL is not
                        // qtext, so force the mime encoded word that a non-ascii filename would get anyway
                        param = /[\x00-\x1f\x7f]/.test(this.filename)
                            ? mimeFuncs.encodeWord(this.filename, this._getTextEncoding(this.filename), 52)
                            : this._encodeWords(this.filename);
                        if (param !== this.filename || /[\s'"\\;:/=(),<>@[\]?]|^-/.test(param)) {
                            // include value in quotes if needed, escaping backslashes and quotes as
                            // quoted-pairs exactly like buildHeaderValue does for filename=, otherwise
                            // a trailing backslash would escape the closing quote
                            param = JSON.stringify(param);
                        }
                        value += '; name=' + param;
                    }
                    break;
                case 'Bcc':
                    if (!this.keepBcc) {
                        // skip BCC values
                        return;
                    }
                    break;
            }
            value = this._encodeHeaderValue(key, value);
            // skip empty lines
            if (!(value || '').toString().trim()) {
                return;
            }
            if (typeof this.normalizeHeaderKey === 'function') {
                const normalized = this.normalizeHeaderKey(key, value);
                // the result replaces the key on the way into the header, so it gets the same
                // treatment the key it replaces already had. a line break here would end the
                // header and start one of the caller's own
                const cleaned = typeof normalized === 'string' ? normalized.replace(/[\x00-\x1f\x7f]/g, '') : '';
                if (cleaned) {
                    key = cleaned;
                }
            }
            headers.push(mimeFuncs.foldLines(key + ': ' + value, 76));
        });
        return headers.join('\r\n');
    }
    /**
     * Streams the rfc2822 message from the current node. If this is a root node,
     * mandatory header fields are set if missing (Date, Message-Id, MIME-Version)
     *
     * @return Compiled message
     */
    createReadStream(options) {
        options = options || {};
        const stream = new node_stream_1.PassThrough(options);
        let outputStream = stream;
        let transform;
        this.stream(stream, options, err => {
            if (err) {
                outputStream.emit('error', err);
                return;
            }
            stream.end();
        });
        for (let i = 0, len = this._transforms.length; i < len; i++) {
            transform =
                typeof this._transforms[i] === 'function' ? this._transforms[i]() : this._transforms[i];
            outputStream.once('error', err => {
                transform.emit('error', err);
            });
            outputStream = outputStream.pipe(transform);
        }
        // ensure terminating newline after possible user transforms
        transform = new last_newline_js_1.default();
        outputStream.once('error', err => {
            transform.emit('error', err);
        });
        outputStream = outputStream.pipe(transform);
        // dkim and stuff
        for (let i = 0, len = this._processFuncs.length; i < len; i++) {
            transform = this._processFuncs[i];
            outputStream = transform(outputStream);
        }
        if (this.newline) {
            const winbreak = ['win', 'windows', 'dos', '\r\n'].includes(this.newline.toString().toLowerCase());
            const newlineTransform = winbreak ? new le_windows_js_1.default() : new le_unix_js_1.default();
            const stream = outputStream.pipe(newlineTransform);
            outputStream.on('error', err => stream.emit('error', err));
            return stream;
        }
        return outputStream;
    }
    /**
     * Appends a transform stream object to the transforms list. Final output
     * is passed through this stream before exposing
     *
     * @param transform Read-Write stream
     */
    transform(transform) {
        this._transforms.push(transform);
    }
    /**
     * Appends a post process function. The functon is run after transforms and
     * uses the following syntax
     *
     *   processFunc(input) -> outputStream
     *
     * @param processFunc Read-Write stream
     */
    processFunc(processFunc) {
        this._processFuncs.push(processFunc);
    }
    stream(outputStream, options, done) {
        const transferEncoding = this.getTransferEncoding();
        let contentStream;
        let localStream;
        // protect actual callback against multiple triggering
        let returned = false;
        const callback = (err) => {
            if (returned) {
                return;
            }
            returned = true;
            done(err);
        };
        // for multipart nodes, push child nodes
        // for content nodes end the stream
        const finalize = () => {
            let childId = 0;
            const processChildNode = () => {
                if (childId >= this.childNodes.length) {
                    outputStream.write('\r\n--' + this.boundary + '--\r\n');
                    return callback();
                }
                const child = this.childNodes[childId++];
                outputStream.write((childId > 1 ? '\r\n' : '') + '--' + this.boundary + '\r\n');
                child.stream(outputStream, options, err => {
                    if (err) {
                        return callback(err);
                    }
                    setImmediate(processChildNode);
                });
            };
            if (this.multipart) {
                setImmediate(processChildNode);
            }
            else {
                return callback();
            }
        };
        // pushes node content
        const sendContent = () => {
            if (this.content) {
                if (Object.prototype.toString.call(this.content) === '[object Error]') {
                    // content is already errored
                    return callback(this.content);
                }
                if (typeof this.content.pipe === 'function') {
                    this.content.removeListener('error', this._contentErrorHandler);
                    this._contentErrorHandler = err => callback(err);
                    this.content.once('error', this._contentErrorHandler);
                }
                const createStream = () => {
                    if (['quoted-printable', 'base64'].includes(transferEncoding)) {
                        contentStream = new (transferEncoding === 'base64' ? base64 : qp).Encoder(options);
                        contentStream.pipe(outputStream, {
                            end: false
                        });
                        contentStream.once('end', finalize);
                        contentStream.once('error', err => callback(err));
                        localStream = this._getStream(this.content);
                        localStream.pipe(contentStream);
                    }
                    else {
                        // anything that is not QP or Base54 passes as-is
                        localStream = this._getStream(this.content);
                        localStream.pipe(outputStream, {
                            end: false
                        });
                        localStream.once('end', finalize);
                    }
                    localStream.once('error', err => callback(err));
                };
                if (this.content._resolve) {
                    const chunks = [];
                    let chunklen = 0;
                    let returned = false;
                    const sourceStream = this._getStream(this.content);
                    sourceStream.on('error', err => {
                        if (returned) {
                            return;
                        }
                        returned = true;
                        callback(err);
                    });
                    sourceStream.on('readable', () => {
                        let chunk;
                        while ((chunk = sourceStream.read()) !== null) {
                            chunks.push(chunk);
                            chunklen += chunk.length;
                        }
                    });
                    sourceStream.on('end', () => {
                        if (returned) {
                            return;
                        }
                        returned = true;
                        this.content._resolve = false;
                        this.content._resolvedValue = Buffer.concat(chunks, chunklen);
                        setImmediate(createStream);
                    });
                }
                else {
                    setImmediate(createStream);
                }
                return;
            }
            return setImmediate(finalize);
        };
        if (this._raw) {
            setImmediate(() => {
                if (Object.prototype.toString.call(this._raw) === '[object Error]') {
                    // content is already errored
                    return callback(this._raw);
                }
                // remove default error handler (if set)
                if (typeof this._raw.pipe === 'function') {
                    this._raw.removeListener('error', this._contentErrorHandler);
                }
                const raw = this._getStream(this._raw);
                raw.pipe(outputStream, {
                    end: false
                });
                raw.on('error', err => outputStream.emit('error', err));
                raw.on('end', finalize);
            });
        }
        else {
            outputStream.write(this.buildHeaders() + '\r\n\r\n');
            setImmediate(sendContent);
        }
    }
    /**
     * Sets envelope to be used instead of the generated one
     *
     * @return SMTP envelope in the form of {from: 'from@example.com', to: ['to@example.com']}
     */
    setEnvelope(envelope) {
        let list;
        this._envelope = {
            from: false,
            to: []
        };
        if (envelope.from) {
            list = [];
            this._convertAddresses(this._parseEnvelopeAddresses(envelope.from), list);
            list = list.filter(address => address && address.address);
            if (list.length && list[0]) {
                this._envelope.from = list[0].address;
            }
        }
        const seenRecipients = new Set();
        const recipients = [];
        ['to', 'cc', 'bcc'].forEach(key => {
            if (envelope[key]) {
                this._convertAddresses(this._parseEnvelopeAddresses(envelope[key]), recipients, seenRecipients);
            }
        });
        this._envelope.to = recipients.map(to => to.address).filter(address => address);
        const standardFields = ['to', 'cc', 'bcc', 'from'];
        shared.copyOwnKeys(this._envelope, envelope, key => standardFields.includes(key));
        return this;
    }
    /**
     * Generates and returns an object with parsed address fields
     *
     * @return Address object
     */
    getAddresses() {
        const addresses = {};
        const seenByKey = new Map();
        this._headers.forEach(header => {
            const key = header.key.toLowerCase();
            if (['from', 'sender', 'reply-to', 'to', 'cc', 'bcc'].includes(key)) {
                if (!Array.isArray(addresses[key])) {
                    addresses[key] = [];
                    seenByKey.set(key, new Set());
                }
                this._convertAddresses(this._parseAddresses(header.value), addresses[key], seenByKey.get(key));
            }
        });
        return addresses;
    }
    /**
     * Generates and returns SMTP envelope with the sender address and a list of recipients addresses
     *
     * @return SMTP envelope in the form of {from: 'from@example.com', to: ['to@example.com']}
     */
    getEnvelope() {
        if (this._envelope) {
            return this._envelope;
        }
        const envelope = {
            from: false,
            to: []
        };
        // Built once and carried across the headers. Letting _convertAddresses seed it per
        // call would cost O(headers x recipients), and a message can carry many address
        // headers: `headers: { to: [...] }` emits one To per entry.
        const seenRecipients = new Set();
        const recipients = [];
        this._headers.forEach(header => {
            const list = [];
            if (header.key === 'From' || (!envelope.from && ['Reply-To', 'Sender'].includes(header.key))) {
                this._convertAddresses(this._parseAddresses(header.value), list);
                if (list.length && list[0]) {
                    envelope.from = list[0].address;
                }
            }
            else if (['To', 'Cc', 'Bcc'].includes(header.key)) {
                this._convertAddresses(this._parseAddresses(header.value), recipients, seenRecipients);
            }
        });
        envelope.to = recipients.map(to => to.address);
        return envelope;
    }
    /**
     * Returns Message-Id value. If it does not exist, then creates one
     *
     * @return Message-Id value
     */
    messageId() {
        let messageId = this.getHeader('Message-ID');
        // You really should define your own Message-Id field!
        if (!messageId) {
            messageId = this._generateMessageId();
            this.setHeader('Message-ID', messageId);
        }
        return messageId;
    }
    /**
     * Sets pregenerated content that will be used as the output of this node
     *
     * @param raw Raw MIME contents
     */
    setRaw(raw) {
        this._raw = raw;
        if (this._raw && typeof this._raw.pipe === 'function') {
            // pre-stream handler. might be triggered if a stream is set as content
            // and 'error' fires before anything is done with this stream
            this._contentErrorHandler = err => {
                this._raw.removeListener('error', this._contentErrorHandler);
                this._raw = err;
            };
            this._raw.once('error', this._contentErrorHandler);
        }
        return this;
    }
    /////// PRIVATE METHODS
    /**
     * Checks an access policy flag for this node and every node above it. The flags are set
     * from the options the node was built with, and createChild only ever sees the options
     * the caller passed, so a child of a closed tree starts out open. Reading the answer off
     * the parent chain keeps it right whatever order the tree was assembled in.
     *
     * @param flag Either 'disableFileAccess' or 'disableUrlAccess'
     * @return true if this node or an ancestor closed that access
     */
    _accessDisabled(flag) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let node = this;
        while (node) {
            if (node[flag]) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
    /**
     * Detects and returns handle to a stream related with the content.
     *
     * @param content Node content
     * @returns Stream object
     */
    _getStream(content) {
        let contentStream;
        if (content._resolvedValue) {
            // pass string or buffer content as a stream
            contentStream = new node_stream_1.PassThrough();
            setImmediate(() => {
                try {
                    contentStream.end(content._resolvedValue);
                }
                catch (_err) {
                    contentStream.emit('error', _err);
                }
            });
            return contentStream;
        }
        if (typeof content.pipe === 'function') {
            // assume as stream
            return content;
        }
        if (content && typeof content.path === 'string' && !content.href) {
            if (this._accessDisabled('disableFileAccess')) {
                contentStream = new node_stream_1.PassThrough();
                setImmediate(() => {
                    const err = new Error('File access rejected for ' + content.path);
                    err.code = errors.EFILEACCESS;
                    contentStream.emit('error', err);
                });
                return contentStream;
            }
            // read file
            return node_fs_1.default.createReadStream(content.path);
        }
        if (content && typeof content.href === 'string') {
            if (this._accessDisabled('disableUrlAccess')) {
                contentStream = new node_stream_1.PassThrough();
                setImmediate(() => {
                    const err = new Error('Url access rejected for ' + content.href);
                    err.code = errors.EURLACCESS;
                    contentStream.emit('error', err);
                });
                return contentStream;
            }
            // fetch URL. nmfetch refuses any scheme that is not http(s), and it decides
            // that on the parsed URL. Testing the raw string here instead would reject
            // forms the parser accepts, such as a leading space or a slash-less authority
            return (0, index_js_2.default)(content.href, { headers: content.httpHeaders, tls: content.tls });
        }
        // pass string or buffer content as a stream
        contentStream = new node_stream_1.PassThrough();
        setImmediate(() => {
            try {
                contentStream.end(content || '');
            }
            catch (_err) {
                contentStream.emit('error', _err);
            }
        });
        return contentStream;
    }
    /**
     * Parses addresses. Takes in a single address or an array or an
     * array of address arrays (eg. To: [[first group], [second group],...])
     *
     * @param addresses Addresses to be parsed
     * @return An array of address objects
     */
    _parseAddresses(addresses) {
        // Collected into one list as we go. concat.apply spreads the entries into arguments
        // and throws a RangeError once a recipient array is long enough to pass the
        // argument limit, which a large Bcc list reaches on its own.
        const flattened = [];
        [].concat(addresses).forEach(address => {
            if (address && address.address) {
                const normalized = this._normalizeAddress(address.address);
                if (normalized === address.address && typeof address.name === 'string') {
                    // there is nothing to rewrite, so there is nothing to keep off the original
                    flattened.push(address);
                    return;
                }
                // rewriting would land on the object the caller passed in and might
                // still hold a reference to, so rewrite a copy of it instead. An own
                // "__proto__" key would make the copy inherit from caller data, and
                // _convertAddresses reads `group` off it straight into the envelope
                const copy = shared.copyOwnKeys({}, address);
                copy.address = normalized;
                copy.name = address.name || '';
                flattened.push(copy);
                return;
            }
            const parsed = this._normalizeParsedAddresses((0, index_js_1.default)(address));
            for (let i = 0; i < parsed.length; i++) {
                flattened.push(parsed[i]);
            }
        });
        return flattened;
    }
    /**
     * Normalizes the addresses of a freshly parsed address list, groups included.
     *
     * Everything this method returns carries a normalized address, whether it arrived as an
     * object or was parsed out of a header value. Without this the two shapes disagree, and
     * a consumer reading the parsed form back is handed the ambiguous
     * 'user@evil.com@good.com' that the header and the envelope no longer carry.
     *
     * @param parsed An array of address objects, as returned by addressparser
     * @return The same array, with every address normalized
     */
    _normalizeParsedAddresses(parsed) {
        // addressparser builds these objects, so no caller holds a reference to rewrite around
        parsed.forEach(entry => {
            if (entry.address) {
                entry.address = this._normalizeAddress(entry.address);
            }
            else if (entry.group) {
                this._normalizeParsedAddresses(entry.group);
            }
        });
        return parsed;
    }
    /**
     * Parses the addresses of an explicitly set envelope.
     *
     * An envelope value is an addr-spec and never a display name, so a bare local username
     * such as 'root' is the address here. Header parsing has to read the same value as a
     * display name, as a value with no '@' in it can not be an addr-spec in a header.
     *
     * @param addresses Addresses to be parsed
     * @return An array of address objects
     */
    _parseEnvelopeAddresses(addresses) {
        return this._parseAddresses(addresses).map(entry => {
            if (entry.address || entry.group || !entry.name || /[\s@]/.test(entry.name)) {
                return entry;
            }
            return { address: this._normalizeAddress(entry.name), name: '' };
        });
    }
    /**
     * Normalizes a header key, uses Camel-Case form, except for uppercase MIME-
     *
     * @param key Key to be normalized
     * @return key in Camel-Case form
     */
    _normalizeHeaderKey(key) {
        key = (key || '')
            .toString()
            // no newlines in keys
            .replace(/\r?\n|\r/g, ' ')
            // a field name is printable ascii without the colon, so a control char or DEL
            // can only be dropped, there is no quoting construct around a field name
            .replace(/[\x00-\x1f\x7f]/g, '')
            .trim()
            .toLowerCase()
            // use uppercase words, except MIME
            .replace(/^X-SMTPAPI$|^(MIME|DKIM|ARC|BIMI)\b|^[a-z]|-(SPF|FBL|ID|MD5)$|-[a-z]/gi, c => c.toUpperCase())
            // special case
            .replace(/^Content-Features$/i, 'Content-features');
        return key;
    }
    /**
     * Checks if the content type is multipart and defines boundary if needed.
     * Doesn't return anything, modifies object argument instead.
     *
     * @param structured Parsed header value for 'Content-Type' key
     */
    _handleContentType(structured) {
        this.contentType = structured.value.trim().toLowerCase();
        this.multipart = /^multipart\//i.test(this.contentType) ? this.contentType.substr(this.contentType.indexOf('/') + 1) : false;
        if (this.multipart) {
            this.boundary = structured.params.boundary =
                structured.params.boundary || this.boundary || this._generateBoundary();
        }
        else {
            this.boundary = false;
        }
    }
    /**
     * Generates a multipart boundary value
     *
     * @return boundary value
     */
    _generateBoundary() {
        return this.rootNode.boundaryPrefix + '-' + this.rootNode.baseBoundary + '-Part_' + this._nodeId;
    }
    /**
     * Encodes a header value for use in the generated rfc2822 email.
     *
     * @param key Header key
     * @param value Header value
     */
    _encodeHeaderValue(key, value) {
        key = this._normalizeHeaderKey(key);
        switch (key) {
            // Structured headers
            case 'From':
            case 'Sender':
            case 'To':
            case 'Cc':
            case 'Bcc':
            case 'Reply-To':
                return this._convertAddresses(this._parseAddresses(value));
            // values enclosed in <>
            case 'Message-ID':
            case 'In-Reply-To':
            case 'Content-Id':
                // a msg-id is structured, so an encoded word inside the angle brackets would
                // be read as literal text. drop the characters that can not appear in a header
                // at all, but leave HT alone, it separates the ids of a multi id value
                value = (value || '')
                    .toString()
                    .replace(/\r?\n|\r/g, ' ')
                    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '');
                if (value.charAt(0) !== '<') {
                    value = '<' + value;
                }
                if (value.charAt(value.length - 1) !== '>') {
                    value = value + '>';
                }
                return value;
            // space separated list of values enclosed in <>
            case 'References':
                value = [].concat
                    .apply([], [].concat(value || '').map(elm => {
                    elm = (elm || '')
                        .toString()
                        .replace(/\r?\n|\r/g, ' ')
                        .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '')
                        .trim();
                    return elm.replace(/<[^>]*>/g, str => str.replace(/\s/g, '')).split(/\s+/);
                }))
                    .map(elm => {
                    if (elm.charAt(0) !== '<') {
                        elm = '<' + elm;
                    }
                    if (elm.charAt(elm.length - 1) !== '>') {
                        elm = elm + '>';
                    }
                    return elm;
                });
                return value.join(' ').trim();
            case 'Date':
                if (Object.prototype.toString.call(value) === '[object Date]') {
                    return value.toUTCString().replace(/GMT/, '+0000');
                }
                value = (value || '').toString().replace(/\r?\n|\r/g, ' ');
                return this._encodeHeaderText(value);
            case 'Content-Type':
            case 'Content-Disposition':
                // if it includes a filename then it is already encoded
                return (value || '').toString().replace(/\r?\n|\r/g, ' ');
            default:
                value = (value || '').toString().replace(/\r?\n|\r/g, ' ');
                return this._encodeHeaderText(value);
        }
    }
    /**
     * Rebuilds address object using punycode and other adjustments
     *
     * @param addresses An array of address objects
     * @param [uniqueList] An array to be populated with addresses
     * @return address string
     */
    _convertAddresses(addresses, uniqueList, seenAddresses) {
        const values = [];
        uniqueList = uniqueList || [];
        // Membership is checked once per address, so scanning uniqueList itself would make
        // a recipient list cost O(n^2). Groups recurse with the same set so that a nested
        // group still dedupes against the addresses collected around it, and a caller that
        // passes a partly filled list (To, then Cc, then Bcc) keeps deduping across headers.
        if (!seenAddresses) {
            seenAddresses = new Set();
            for (let i = 0; i < uniqueList.length; i++) {
                seenAddresses.add(uniqueList[i].address);
            }
        }
        [].concat(addresses || []).forEach(address => {
            if (address.address) {
                address.address = this._normalizeAddress(address.address);
                if (!address.name) {
                    // an address that carries a special, be it a quoted local part or a domain
                    // that could not be normalized, is only unambiguous inside angle brackets.
                    // Without them a ',' or a ';' anywhere in it reads as a recipient separator
                    // and the header would list more recipients than the envelope carries
                    values.push(PLAIN_ADDRESS.test(address.address) ? address.address : `<${address.address}>`);
                }
                else {
                    values.push(`${this._encodeAddressName(address.name)} <${address.address}>`);
                }
                if (!seenAddresses.has(address.address)) {
                    seenAddresses.add(address.address);
                    uniqueList.push(address);
                }
            }
            else if (address.group) {
                const groupListAddresses = (address.group.length ? this._convertAddresses(address.group, uniqueList, seenAddresses) : '').trim();
                values.push(`${this._encodeAddressName(address.name)}:${groupListAddresses};`);
            }
        });
        return values.join(', ');
    }
    /**
     * Normalizes an email address
     *
     * @param address An array of address objects
     * @return address string
     */
    _normalizeAddress(address) {
        address = (address || '')
            .toString()
            .replace(/[\x00-\x1F\x7F<>]+/g, ' ') // remove unallowed characters
            .trim();
        if (!address) {
            // callers use an empty value to detect a missing address
            return address;
        }
        const lastAt = address.lastIndexOf('@');
        if (lastAt < 0) {
            // Bare username, there is no domain to split off
            return this._normalizeLocalPart(address);
        }
        const user = address.substr(0, lastAt);
        const domain = address.substr(lastAt + 1);
        // Unicode in the local part is kept as is, see _normalizeLocalPart for the rest of it.
        // A domain has no quoting construct to fall back on, so whatever is not a valid domain
        // is kept as supplied and it is _convertAddresses that keeps such an address unambiguous.
        // Domains are punycoded when the local part is ASCII ('safe@jõgeva.ee' -> 'safe@xn--jgeva-dua.ee').
        // When the local part contains non-ASCII bytes the address already requires SMTPUTF8,
        // so the domain is kept (or decoded back) as UTF-8 for symmetry on both sides of '@'.
        let encodedDomain = domain;
        // A non-ASCII local part already requires SMTPUTF8, so the domain stays UTF-8 for
        // symmetry on both sides of the '@' rather than being encoded to an A-label
        const smtputf8 = /[\x80-\uFFFF]/.test(user);
        try {
            encodedDomain = normalizeDomain(domain.toLowerCase(), smtputf8);
        }
        catch (_err) {
            // keep domain as supplied
        }
        return `${this._normalizeLocalPart(user)}@${encodedDomain}`;
    }
    /**
     * Normalizes the local part of an address into a form that can be emitted as is.
     *
     * A local part is either a dot-atom or a quoted-string, anything else is not a valid
     * addr-spec. The quotes of a quoted local part get lost along the way, and a bare
     * 'user@evil.com@good.com' leaves it to the receiver which '@' splits the domain off,
     * while the split here is always at the last one. So whatever is not already one of
     * the two valid forms goes back out as a quoted-string.
     *
     * @param user Local part of an address
     * @return Local part as a dot-atom or as a quoted-string
     */
    _normalizeLocalPart(user) {
        if (DOT_ATOM.test(user) || QUOTED_STRING.test(user)) {
            return user;
        }
        return mimeFuncs.quoteString(user);
    }
    /**
     * If needed, mime encodes the name part
     *
     * @param name Name part of an address
     * @returns Mime word encoded string if needed
     */
    _encodeAddressName(name) {
        if (!/^[\w ]*$/.test(name)) {
            if (/^[\x20-\x7e]*$/.test(name)) {
                return mimeFuncs.quoteString(name);
            }
            else {
                return mimeFuncs.encodeWord(name, this._getTextEncoding(name), 52);
            }
        }
        return name;
    }
    /**
     * Encodes an unstructured header value. Such a value can only carry VCHAR and WSP, so a
     * control char or DEL has to be forced into the mime encoded word that a non-ascii value
     * would get anyway. HT stays as it is, it is valid folding whitespace here.
     *
     * @param value Header value to encode
     * @returns Mime word encoded string if needed
     */
    _encodeHeaderText(value) {
        return /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value)
            ? mimeFuncs.encodeWord(value, this._getTextEncoding(value), 52)
            : // encodeWords only encodes if needed, otherwise the original string is returned
                this._encodeWords(value);
    }
    /**
     * If needed, mime encodes the name part
     *
     * @param name Name part of an address
     * @returns Mime word encoded string if needed
     */
    _encodeWords(value) {
        // set encodeAll parameter to true even though it is against the recommendation of RFC2047,
        // by default only words that include non-ascii should be converted into encoded words
        // but some clients (eg. Zimbra) do not handle it properly and remove surrounding whitespace
        return mimeFuncs.encodeWords(value, this._getTextEncoding(value), 52, true);
    }
    /**
     * Detects best mime encoding for a text value
     *
     * @param value Value to check for
     * @return either 'Q' or 'B'
     */
    _getTextEncoding(value) {
        value = (value || '').toString();
        if (this.textEncoding) {
            return this.textEncoding;
        }
        // count latin alphabet symbols and 8-bit range symbols + control symbols
        // if there are more latin characters, then use quoted-printable
        // encoding, otherwise use base64
        let nonLatinLen = 0;
        let latinLen = 0;
        for (let i = 0, len = value.length; i < len; i++) {
            const code = value.charCodeAt(i);
            if ((code >= 0x00 && code <= 0x08) || code === 0x0b || code === 0x0c || (code >= 0x0e && code <= 0x1f) || code >= 0x80) {
                nonLatinLen++;
            }
            else if ((code >= 0x41 && code <= 0x5a) || (code >= 0x61 && code <= 0x7a)) {
                latinLen++;
            }
        }
        // if there are more latin symbols than binary/unicode, then prefer Q, otherwise B
        return nonLatinLen < latinLen ? 'Q' : 'B';
    }
    /**
     * Generates a message id
     *
     * @return Random Message-ID value
     */
    _generateMessageId() {
        return ('<' +
            [2, 2, 2, 6].reduce(
            // crux to generate UUID-like random strings
            (prev, len) => prev + '-' + node_crypto_1.default.randomBytes(len).toString('hex'), node_crypto_1.default.randomBytes(4).toString('hex')) +
            '@' +
            // try to use the domain of the FROM address or fallback to server hostname
            (this.getEnvelope().from || this.hostname || 'localhost').split('@').pop() +
            '>');
    }
}
exports["default"] = MimeNode;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 2486:
/***/ ((module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const node_stream_1 = __nccwpck_require__(7075);
class LastNewline extends node_stream_1.Transform {
    constructor() {
        super();
        this.lastByte = false;
    }
    _transform(chunk, encoding, done) {
        if (chunk.length) {
            this.lastByte = chunk[chunk.length - 1];
        }
        this.push(chunk);
        done();
    }
    _flush(done) {
        if (this.lastByte === 0x0a) {
            return done();
        }
        if (this.lastByte === 0x0d) {
            this.push(Buffer.from('\n'));
            return done();
        }
        this.push(Buffer.from('\r\n'));
        return done();
    }
}
exports["default"] = LastNewline;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 8367:
/***/ ((module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const node_stream_1 = __nccwpck_require__(7075);
/**
 * Ensures that only <LF> is used for linebreaks
 *
 * @param options Stream options
 */
class LeUnix extends node_stream_1.Transform {
    constructor(options) {
        super(options);
    }
    /**
     * Escapes dots
     */
    _transform(chunk, encoding, done) {
        let buf;
        let lastPos = 0;
        for (let i = 0, len = chunk.length; i < len; i++) {
            if (chunk[i] === 0x0d) {
                // \r
                buf = chunk.slice(lastPos, i);
                lastPos = i + 1;
                this.push(buf);
            }
        }
        if (lastPos && lastPos < chunk.length) {
            buf = chunk.slice(lastPos);
            this.push(buf);
        }
        else if (!lastPos) {
            this.push(chunk);
        }
        done();
    }
}
exports["default"] = LeUnix;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 7636:
/***/ ((module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const node_stream_1 = __nccwpck_require__(7075);
/**
 * Ensures that only <CR><LF> sequences are used for linebreaks
 *
 * @param options Stream options
 */
class LeWindows extends node_stream_1.Transform {
    constructor(options) {
        super(options);
        this.lastByte = false;
    }
    /**
     * Escapes dots
     */
    _transform(chunk, encoding, done) {
        let buf;
        let lastPos = 0;
        for (let i = 0, len = chunk.length; i < len; i++) {
            if (chunk[i] === 0x0a) {
                // \n
                if ((i && chunk[i - 1] !== 0x0d) || (!i && this.lastByte !== 0x0d)) {
                    if (i > lastPos) {
                        buf = chunk.slice(lastPos, i);
                        this.push(buf);
                    }
                    this.push(Buffer.from('\r\n'));
                    lastPos = i + 1;
                }
            }
        }
        if (lastPos && lastPos < chunk.length) {
            buf = chunk.slice(lastPos);
            this.push(buf);
        }
        else if (!lastPos) {
            this.push(chunk);
        }
        this.lastByte = chunk[chunk.length - 1];
        done();
    }
}
exports["default"] = LeWindows;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 1935:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createTransport = createTransport;
exports.createTestAccount = createTestAccount;
exports.getTestMessageUrl = getTestMessageUrl;
const index_js_1 = __importDefault(__nccwpck_require__(4844));
const shared = __importStar(__nccwpck_require__(9893));
const index_js_2 = __importDefault(__nccwpck_require__(5013));
const index_js_3 = __importDefault(__nccwpck_require__(284));
const index_js_4 = __importDefault(__nccwpck_require__(4013));
const index_js_5 = __importDefault(__nccwpck_require__(9116));
const index_js_6 = __importDefault(__nccwpck_require__(6518));
const index_js_7 = __importDefault(__nccwpck_require__(8013));
const errors = __importStar(__nccwpck_require__(932));
const index_js_8 = __importDefault(__nccwpck_require__(7336));
const packageData = __importStar(__nccwpck_require__(5552));
const ETHEREAL_API = (process.env.ETHEREAL_API || 'https://api.nodemailer.com').replace(/\/+$/, '');
const ETHEREAL_WEB = (process.env.ETHEREAL_WEB || 'https://ethereal.email').replace(/\/+$/, '');
const ETHEREAL_API_KEY = (process.env.ETHEREAL_API_KEY || '').replace(/\s*/g, '') || null;
const ETHEREAL_CACHE = ['true', 'yes', 'y', '1'].includes((process.env.ETHEREAL_CACHE || 'yes').toString().trim().toLowerCase());
let testAccount = false;
function createTransport(transporter, defaults) {
    let options;
    if (
    // provided transporter is a configuration object, not transporter plugin
    (typeof transporter === 'object' && typeof transporter.send !== 'function') ||
        // provided transporter looks like a connection url
        (typeof transporter === 'string' && /^(smtps?|direct):/i.test(transporter))) {
        const urlConfig = typeof transporter === 'string' ? transporter : transporter.url;
        if (urlConfig) {
            // parse a configuration URL into configuration options. The other keys of a
            // configuration object apply where the url does not set them, merged the same
            // way the SMTP transports merge their own url option
            const parsed = shared.parseConnectionUrl(urlConfig);
            options = (typeof transporter === 'object'
                ? shared.assign(false, shared.copyOwnKeys({}, transporter, key => key === 'url'), parsed)
                : parsed);
        }
        else {
            options = transporter;
        }
        if (options.pool) {
            transporter = new index_js_2.default(options);
        }
        else if (options.sendmail) {
            transporter = new index_js_4.default(options);
        }
        else if (options.streamTransport) {
            transporter = new index_js_5.default(options);
        }
        else if (options.jsonTransport) {
            transporter = new index_js_6.default(options);
        }
        else if (options.SES) {
            const ses = options.SES;
            if (ses.ses && ses.aws) {
                const error = new Error('Using legacy SES configuration, expecting @aws-sdk/client-sesv2, see https://nodemailer.com/transports/ses/');
                error.code = errors.ECONFIG;
                throw error;
            }
            transporter = new index_js_7.default(options);
        }
        else {
            transporter = new index_js_3.default(options);
        }
    }
    return new index_js_1.default(transporter, options, defaults);
}
function createTestAccount(apiUrl, callback) {
    let promise;
    if (!callback && typeof apiUrl === 'function') {
        callback = apiUrl;
        apiUrl = false;
    }
    if (!callback) {
        promise = new Promise((resolve, reject) => {
            callback = shared.callbackPromise(resolve, reject);
        });
    }
    const done = callback;
    if (ETHEREAL_CACHE && testAccount) {
        setImmediate(() => done(null, testAccount));
        return promise;
    }
    apiUrl = apiUrl || ETHEREAL_API;
    const chunks = [];
    let chunklen = 0;
    const requestHeaders = {};
    const requestBody = {
        requestor: packageData.name,
        version: packageData.version
    };
    if (ETHEREAL_API_KEY) {
        requestHeaders.Authorization = 'Bearer ' + ETHEREAL_API_KEY;
    }
    const fetchOptions = {
        contentType: 'application/json',
        method: 'POST',
        headers: requestHeaders,
        body: Buffer.from(JSON.stringify(requestBody))
    };
    // Credential-bearing request to the Ethereal API. src/fetch already
    // validates certs by default; pin rejectUnauthorized:true here so this
    // call stays strict regardless of any future default change and is never
    // relaxed for a real-cert endpoint.
    if (/^https:/i.test(apiUrl)) {
        fetchOptions.tls = { rejectUnauthorized: true };
    }
    const req = (0, index_js_8.default)(apiUrl + '/user', fetchOptions);
    req.on('readable', () => {
        let chunk;
        while ((chunk = req.read()) !== null) {
            chunks.push(chunk);
            chunklen += chunk.length;
        }
    });
    req.once('error', err => done(err));
    req.once('end', () => {
        const res = Buffer.concat(chunks, chunklen);
        let data;
        try {
            data = JSON.parse(res.toString());
        }
        catch (E) {
            return done(E);
        }
        if (data.status !== 'success' || data.error) {
            return done(new Error(data.error || 'Request failed'));
        }
        delete data.status;
        testAccount = data;
        done(null, testAccount);
    });
    return promise;
}
/**
 * Resolves the Ethereal web URL for a message sent through an Ethereal test account
 *
 * @param info Result object of sendMail()
 * @returns URL of the message in the Ethereal web interface, or false if the response does not carry one
 */
function getTestMessageUrl(info) {
    if (!info || !info.response) {
        return false;
    }
    const infoProps = new Map();
    // Extract the trailing "[...]" part of the response (no "]" allowed inside)
    // with linear string scanning; the equivalent regex /\[([^\]]+)\]$/ was
    // flagged for polynomial backtracking on adversarial server responses
    const response = info.response.toString();
    if (response.length > 2 && response.charAt(response.length - 1) === ']') {
        const open = response.indexOf('[', response.lastIndexOf(']', response.length - 2) + 1);
        if (open >= 0 && open < response.length - 2) {
            const props = response.substring(open + 1, response.length - 1);
            props.replace(/\b([A-Z0-9]+)=([^\s]+)/g, (m, key, value) => {
                infoProps.set(key, value);
                return m;
            });
        }
    }
    if (infoProps.has('STATUS') && infoProps.has('MSGID')) {
        return ((testAccount && testAccount.web) || ETHEREAL_WEB) + '/message/' + infoProps.get('MSGID');
    }
    return false;
}
const nodemailer = {
    createTransport,
    createTestAccount,
    getTestMessageUrl
};
exports["default"] = nodemailer;


/***/ }),

/***/ 5552:
/***/ ((__unused_webpack_module, exports) => {


// Generated by scripts/build.js from package.json. Do not edit by hand.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.homepage = exports.version = exports.name = void 0;
exports.name = 'nodemailer';
exports.version = '10.0.0';
exports.homepage = 'https://nodemailer.com/';


/***/ }),

/***/ 111:
/***/ ((__unused_webpack_module, exports) => {


/*

Copied from https://github.com/mathiasbynens/punycode.js/blob/ef3505c8abb5143a00d53ce59077c9f7f4b2ac47/punycode.js

Copyright Mathias Bynens <https://mathiasbynens.be/>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
/* eslint callback-return: 0, no-bitwise: 0, eqeqeq: 0, prefer-arrow-callback: 0 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toUnicode = exports.toASCII = exports.encode = exports.decode = exports.ucs2 = exports.version = void 0;
/** Highest positive signed 32-bit float value */
const maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
/** Bootstring parameters */
const base = 36;
const tMin = 1;
const tMax = 26;
const skew = 38;
const damp = 700;
const initialBias = 72;
const initialN = 128; // 0x80
const delimiter = '-'; // '\x2D'
/** Regular expressions */
const regexPunycode = /^xn--/;
const regexNonASCII = /[^\0-\x7F]/; // Note: U+007F DEL is excluded too.
const regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
/** Error messages */
const errors = {
    overflow: 'Overflow: input needs wider integers to process',
    'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
    'invalid-input': 'Invalid input'
};
/** Convenience shortcuts */
const baseMinusTMin = base - tMin;
const floor = Math.floor;
const stringFromCharCode = String.fromCharCode;
/*--------------------------------------------------------------------------*/
/**
 * A generic error utility function.
 * @private
 * @param type The error type.
 * @returns Throws a `RangeError` with the applicable error message.
 */
function error(type) {
    throw new RangeError(errors[type]);
}
/**
 * A generic `Array#map` utility function.
 * @private
 * @param array The array to iterate over.
 * @param callback The function that gets called for every array
 * item.
 * @returns A new array of values returned by the callback function.
 */
function map(array, callback) {
    const result = [];
    let length = array.length;
    while (length--) {
        result[length] = callback(array[length]);
    }
    return result;
}
/**
 * A simple `Array#map`-like wrapper to work with domain name strings or email
 * addresses.
 * @private
 * @param domain The domain name or email address.
 * @param callback The function that gets called for every
 * character.
 * @returns A new string of characters returned by the callback
 * function.
 */
function mapDomain(domain, callback) {
    const parts = domain.split('@');
    let result = '';
    if (parts.length > 1) {
        // In email addresses, only the domain name should be punycoded. Leave
        // the local part (i.e. everything up to `@`) intact.
        result = parts[0] + '@';
        domain = parts[1];
    }
    // Avoid `split(regex)` for IE8 compatibility. See #17.
    domain = domain.replace(regexSeparators, '\x2E');
    const labels = domain.split('.');
    const encoded = map(labels, callback).join('.');
    return result + encoded;
}
/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 * @see `punycode.ucs2.encode`
 * @see <https://mathiasbynens.be/notes/javascript-encoding>
 * @memberOf punycode.ucs2
 * @name decode
 * @param string The Unicode input string (UCS-2).
 * @returns The new array of code points.
 */
function ucs2decode(string) {
    const output = [];
    let counter = 0;
    const length = string.length;
    while (counter < length) {
        const value = string.charCodeAt(counter++);
        if (value >= 0xd800 && value <= 0xdbff && counter < length) {
            // It's a high surrogate, and there is a next character.
            const extra = string.charCodeAt(counter++);
            if ((extra & 0xfc00) == 0xdc00) {
                // Low surrogate.
                output.push(((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000);
            }
            else {
                // It's an unmatched surrogate; only append this code unit, in case the
                // next code unit is the high surrogate of a surrogate pair.
                output.push(value);
                counter--;
            }
        }
        else {
            output.push(value);
        }
    }
    return output;
}
/**
 * Creates a string based on an array of numeric code points.
 * @see `punycode.ucs2.decode`
 * @memberOf punycode.ucs2
 * @name encode
 * @param codePoints The array of numeric code points.
 * @returns The new Unicode string (UCS-2).
 */
const ucs2encode = (codePoints) => String.fromCodePoint(...codePoints);
/**
 * Converts a basic code point into a digit/integer.
 * @see `digitToBasic()`
 * @private
 * @param codePoint The basic numeric code point value.
 * @returns The numeric value of a basic code point (for use in
 * representing integers) in the range `0` to `base - 1`, or `base` if
 * the code point does not represent a value.
 */
const basicToDigit = function (codePoint) {
    if (codePoint >= 0x30 && codePoint < 0x3a) {
        return 26 + (codePoint - 0x30);
    }
    if (codePoint >= 0x41 && codePoint < 0x5b) {
        return codePoint - 0x41;
    }
    if (codePoint >= 0x61 && codePoint < 0x7b) {
        return codePoint - 0x61;
    }
    return base;
};
/**
 * Converts a digit/integer into a basic code point.
 * @see `basicToDigit()`
 * @private
 * @param digit The numeric value of a basic code point.
 * @returns The basic code point whose value (when used for
 * representing integers) is `digit`, which needs to be in the range
 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
 * used; else, the lowercase form is used. The behavior is undefined
 * if `flag` is non-zero and `digit` has no uppercase form.
 */
const digitToBasic = function (digit, flag) {
    //  0..25 map to ASCII a..z or A..Z
    // 26..35 map to ASCII 0..9
    return digit + 22 + 75 * Number(digit < 26) - (Number(flag != 0) << 5);
};
/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 * @private
 */
const adapt = function (delta, numPoints, firstTime) {
    let k = 0;
    delta = firstTime ? floor(delta / damp) : delta >> 1;
    delta += floor(delta / numPoints);
    for (; /* no initialization */ delta > (baseMinusTMin * tMax) >> 1; k += base) {
        delta = floor(delta / baseMinusTMin);
    }
    return floor(k + ((baseMinusTMin + 1) * delta) / (delta + skew));
};
/**
 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
 * symbols.
 * @memberOf punycode
 * @param input The Punycode string of ASCII-only symbols.
 * @returns The resulting string of Unicode symbols.
 */
const decode = function (input) {
    // Don't use UCS-2.
    const output = [];
    const inputLength = input.length;
    let i = 0;
    let n = initialN;
    let bias = initialBias;
    // Handle the basic code points: let `basic` be the number of input code
    // points before the last delimiter, or `0` if there is none, then copy
    // the first basic code points to the output.
    let basic = input.lastIndexOf(delimiter);
    if (basic < 0) {
        basic = 0;
    }
    for (let j = 0; j < basic; ++j) {
        // if it's not a basic code point
        if (input.charCodeAt(j) >= 0x80) {
            error('not-basic');
        }
        output.push(input.charCodeAt(j));
    }
    // Main decoding loop: start just after the last delimiter if any basic code
    // points were copied; start at the beginning otherwise.
    for (let index = basic > 0 ? basic + 1 : 0; index < inputLength /* no final expression */;) {
        // `index` is the index of the next character to be consumed.
        // Decode a generalized variable-length integer into `delta`,
        // which gets added to `i`. The overflow checking is easier
        // if we increase `i` as we go, then subtract off its starting
        // value at the end to obtain `delta`.
        const oldi = i;
        for (let w = 1, k = base /* no condition */;; k += base) {
            if (index >= inputLength) {
                error('invalid-input');
            }
            const digit = basicToDigit(input.charCodeAt(index++));
            if (digit >= base) {
                error('invalid-input');
            }
            if (digit > floor((maxInt - i) / w)) {
                error('overflow');
            }
            i += digit * w;
            const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
            if (digit < t) {
                break;
            }
            const baseMinusT = base - t;
            if (w > floor(maxInt / baseMinusT)) {
                error('overflow');
            }
            w *= baseMinusT;
        }
        const out = output.length + 1;
        bias = adapt(i - oldi, out, oldi == 0);
        // `i` was supposed to wrap around from `out` to `0`,
        // incrementing `n` each time, so we'll fix that now:
        if (floor(i / out) > maxInt - n) {
            error('overflow');
        }
        n += floor(i / out);
        i %= out;
        // Insert `n` at position `i` of the output.
        output.splice(i++, 0, n);
    }
    return String.fromCodePoint(...output);
};
exports.decode = decode;
/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 * @memberOf punycode
 * @param input The string of Unicode symbols.
 * @returns The resulting Punycode string of ASCII-only symbols.
 */
const encode = function (input) {
    const output = [];
    // Convert the input in UCS-2 to an array of Unicode code points.
    const codePoints = ucs2decode(input);
    // Cache the length.
    const inputLength = codePoints.length;
    // Initialize the state.
    let n = initialN;
    let delta = 0;
    let bias = initialBias;
    // Handle the basic code points.
    for (const currentValue of codePoints) {
        if (currentValue < 0x80) {
            output.push(stringFromCharCode(currentValue));
        }
    }
    const basicLength = output.length;
    let handledCPCount = basicLength;
    // `handledCPCount` is the number of code points that have been handled;
    // `basicLength` is the number of basic code points.
    // Finish the basic string with a delimiter unless it's empty.
    if (basicLength) {
        output.push(delimiter);
    }
    // Main encoding loop:
    while (handledCPCount < inputLength) {
        // All non-basic code points < n have been handled already. Find the next
        // larger one:
        let m = maxInt;
        for (const currentValue of codePoints) {
            if (currentValue >= n && currentValue < m) {
                m = currentValue;
            }
        }
        // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
        // but guard against overflow.
        const handledCPCountPlusOne = handledCPCount + 1;
        if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
            error('overflow');
        }
        delta += (m - n) * handledCPCountPlusOne;
        n = m;
        for (const currentValue of codePoints) {
            if (currentValue < n && ++delta > maxInt) {
                error('overflow');
            }
            if (currentValue === n) {
                // Represent delta as a generalized variable-length integer.
                let q = delta;
                for (let k = base /* no condition */;; k += base) {
                    const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                    if (q < t) {
                        break;
                    }
                    const qMinusT = q - t;
                    const baseMinusT = base - t;
                    output.push(stringFromCharCode(digitToBasic(t + (qMinusT % baseMinusT), 0)));
                    q = floor(qMinusT / baseMinusT);
                }
                output.push(stringFromCharCode(digitToBasic(q, 0)));
                bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
                delta = 0;
                ++handledCPCount;
            }
        }
        ++delta;
        ++n;
    }
    return output.join('');
};
exports.encode = encode;
/**
 * Converts a Punycode string representing a domain name or an email address
 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
 * it doesn't matter if you call it on a string that has already been
 * converted to Unicode.
 * @memberOf punycode
 * @param input The Punycoded domain name or email address to
 * convert to Unicode.
 * @returns The Unicode representation of the given Punycode
 * string.
 */
const toUnicode = function (input) {
    return mapDomain(input, function (string) {
        return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
    });
};
exports.toUnicode = toUnicode;
/**
 * Converts a Unicode string representing a domain name or an email address to
 * Punycode. Only the non-ASCII parts of the domain name will be converted,
 * i.e. it doesn't matter if you call it with a domain that's already in
 * ASCII.
 * @memberOf punycode
 * @param input The domain name or email address to convert, as a
 * Unicode string.
 * @returns The Punycode representation of the given domain name or
 * email address.
 */
const toASCII = function (input) {
    return mapDomain(input, function (string) {
        return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
    });
};
exports.toASCII = toASCII;
/*--------------------------------------------------------------------------*/
/** Define the public API */
/**
 * A string representing the current Punycode.js version number.
 * @memberOf punycode
 * @type String
 */
exports.version = '2.3.1';
/**
 * An object of methods to convert from JavaScript's internal character
 * representation (UCS-2) to Unicode code points, and back.
 * @see <https://mathiasbynens.be/notes/javascript-encoding>
 * @memberOf punycode
 * @type Object
 */
exports.ucs2 = {
    decode: ucs2decode,
    encode: ucs2encode
};


/***/ }),

/***/ 7529:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Encoder = void 0;
exports.encode = encode;
exports.wrap = wrap;
const node_stream_1 = __nccwpck_require__(7075);
/**
 * Encodes a Buffer into a Quoted-Printable encoded string
 *
 * @param buffer Buffer to convert
 * @returns Quoted-Printable encoded string
 */
// usable characters that do not need encoding
// https://tools.ietf.org/html/rfc2045#section-6.7
const QP_RANGES = [
    [0x09], // <TAB>
    [0x0a], // <LF>
    [0x0d], // <CR>
    [0x20, 0x3c], // <SP>!"#$%&'()*+,-./0123456789:;
    [0x3e, 0x7e] // >?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}
];
function encode(buffer) {
    if (typeof buffer === 'string') {
        buffer = Buffer.from(buffer, 'utf-8');
    }
    let result = '';
    let ord;
    for (let i = 0, len = buffer.length; i < len; i++) {
        ord = buffer[i];
        // if the char is in allowed range, then keep as is, unless it is a WS in the end of a line
        if (checkRanges(ord, QP_RANGES) &&
            !((ord === 0x20 || ord === 0x09) && (i === len - 1 || buffer[i + 1] === 0x0a || buffer[i + 1] === 0x0d))) {
            result += String.fromCharCode(ord);
            continue;
        }
        result += '=' + (ord < 0x10 ? '0' : '') + ord.toString(16).toUpperCase();
    }
    return result;
}
/**
 * Adds soft line breaks to a Quoted-Printable string
 *
 * @param str Quoted-Printable encoded string that might need line wrapping
 * @param [lineLength=76] Maximum allowed length for a line
 * @returns Soft-wrapped Quoted-Printable encoded string
 */
function wrap(str, lineLength) {
    str = (str || '').toString();
    lineLength = lineLength || 76;
    if (str.length <= lineLength) {
        return str;
    }
    let pos = 0;
    const len = str.length;
    let match, code, line;
    const lineMargin = Math.floor(lineLength / 3);
    let result = '';
    // insert soft linebreaks where needed
    while (pos < len) {
        line = str.substr(pos, lineLength);
        if ((match = line.match(/\r\n/))) {
            line = line.substr(0, match.index + match[0].length);
            result += line;
            pos += line.length;
            continue;
        }
        if (line.substr(-1) === '\n') {
            result += line;
            pos += line.length;
            continue;
        }
        if ((match = line.substr(-lineMargin).match(/\n.*?$/))) {
            // truncate to nearest line break
            line = line.substr(0, line.length - (match[0].length - 1));
            result += line;
            pos += line.length;
            continue;
        }
        if (line.length > lineLength - lineMargin && (match = line.substr(-lineMargin).match(/[ \t.,!?][^ \t.,!?]*$/))) {
            // truncate to nearest space
            line = line.substr(0, line.length - (match[0].length - 1));
        }
        else if (line.match(/[=][\da-f]{0,2}$/i)) {
            // push incomplete encoding sequences to the next line
            if ((match = line.match(/[=][\da-f]{0,1}$/i))) {
                line = line.substr(0, line.length - match[0].length);
            }
            // ensure that utf-8 sequences are not split
            while (line.length > 3 &&
                line.length < len - pos &&
                !line.match(/^(?:=[\da-f]{2}){1,4}$/i) &&
                (match = line.match(/[=][\da-f]{2}$/gi))) {
                code = parseInt(match[0].substr(1, 2), 16);
                if (code < 128) {
                    break;
                }
                line = line.substr(0, line.length - 3);
                if (code >= 0xc0) {
                    break;
                }
            }
        }
        if (pos + line.length < len && line.substr(-1) !== '\n') {
            if (line.length === lineLength && line.match(/[=][\da-f]{2}$/i)) {
                line = line.substr(0, line.length - 3);
            }
            else if (line.length === lineLength) {
                line = line.substr(0, line.length - 1);
            }
            pos += line.length;
            line += '=\r\n';
        }
        else {
            pos += line.length;
        }
        result += line;
    }
    return result;
}
/**
 * Helper function to check if a number is inside provided ranges
 *
 * @param nr Number to check for
 * @param ranges An Array of allowed values
 * @returns True if the value was found inside allowed ranges, false otherwise
 */
function checkRanges(nr, ranges) {
    for (let i = ranges.length - 1; i >= 0; i--) {
        const range = ranges[i];
        if (!range.length) {
            continue;
        }
        if (range.length === 1 && nr === range[0]) {
            return true;
        }
        if (range.length === 2 && nr >= range[0] && nr <= range[1]) {
            return true;
        }
    }
    return false;
}
/**
 * Creates a transform stream for encoding data to Quoted-Printable encoding
 *
 * @constructor
 * @param options Stream options
 * @param [options.lineLength=76] Maximum length for lines, set to false to disable wrapping
 */
class Encoder extends node_stream_1.Transform {
    constructor(options) {
        super();
        this.options = options || {};
        if (this.options.lineLength !== false) {
            this.options.lineLength = this.options.lineLength || 76;
        }
        this._curLine = '';
        this.inputBytes = 0;
        this.outputBytes = 0;
    }
    _transform(chunk, encoding, done) {
        let qp;
        if (encoding !== 'buffer') {
            chunk = Buffer.from(chunk, encoding);
        }
        if (!chunk || !chunk.length) {
            return done();
        }
        this.inputBytes += chunk.length;
        if (this.options.lineLength) {
            qp = this._curLine + encode(chunk);
            qp = wrap(qp, this.options.lineLength);
            qp = qp.replace(/(^|\n)([^\n]*)$/, (match, lineBreak, lastLine) => {
                this._curLine = lastLine;
                return lineBreak;
            });
            if (qp) {
                this.outputBytes += qp.length;
                this.push(qp);
            }
        }
        else {
            qp = encode(chunk);
            this.outputBytes += qp.length;
            this.push(qp, 'ascii');
        }
        done();
    }
    _flush(done) {
        if (this._curLine) {
            this.outputBytes += this._curLine.length;
            this.push(this._curLine, 'ascii');
        }
        done();
    }
}
exports.Encoder = Encoder;


/***/ }),

/***/ 4013:
/***/ (function(module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const node_child_process_1 = __nccwpck_require__(1421);
const packageData = __importStar(__nccwpck_require__(5552));
const shared = __importStar(__nccwpck_require__(9893));
const errors = __importStar(__nccwpck_require__(932));
const le_windows_js_1 = __importDefault(__nccwpck_require__(7636));
const le_unix_js_1 = __importDefault(__nccwpck_require__(8367));
/**
 * Generates a Transport object for Sendmail
 *
 * Possible options can be the following:
 *
 *  * **path** optional path to sendmail binary
 *  * **newline** either 'windows' or 'unix'
 *  * **args** an array of arguments for the sendmail binary
 *
 * @constructor
 * @param optional config parameter for Sendmail
 */
class SendmailTransport {
    constructor(options) {
        options = options || {};
        // use a reference to spawn for mocking purposes
        this._spawn = node_child_process_1.spawn;
        this.options = options;
        this.name = 'Sendmail';
        this.version = packageData.version;
        this.path = 'sendmail';
        this.args = false;
        this.logger = shared.getLogger(this.options, {
            component: this.options.component || 'sendmail'
        });
        if (typeof options === 'string') {
            this.path = options;
        }
        else if (typeof options === 'object') {
            if (options.path) {
                this.path = options.path;
            }
            if (Array.isArray(options.args)) {
                this.args = options.args;
            }
        }
        this.winbreak = ['win', 'windows', 'dos', '\r\n'].includes((options.newline || '').toString().toLowerCase());
    }
    /**
     * <p>Compiles a mailcomposer message and forwards it to handler that sends it.</p>
     *
     * @param mail MailComposer object
     * @param done Callback function to run when the sending is completed
     */
    send(mail, done) {
        // Sendmail strips this header line by itself. send() runs after the message was
        // compiled, so mail.message is set
        mail.message.keepBcc = true;
        const envelope = mail.message.getEnvelope();
        const messageId = mail.message.messageId();
        let returned;
        const hasInvalidAddresses = []
            .concat(envelope.from || [])
            .concat(envelope.to || [])
            // a local part is either a dot-atom or a quoted-string, so a leading dash sits at
            // offset 0 or, behind the opening quote, at offset 1. Only the first shape is read
            // as an option by sendmail, but both are the address this guard keeps out of argv
            .some(addr => /^"?-/.test(addr));
        if (hasInvalidAddresses) {
            const err = new Error('Can not send mail. Invalid envelope addresses.');
            err.code = errors.ESENDMAIL;
            return done(err);
        }
        // force -i to keep single dots
        const args = this.args
            ? ['-i'].concat(this.args).concat(envelope.to)
            : ['-i'].concat(envelope.from ? ['-f', envelope.from] : []).concat(envelope.to);
        const callback = (err) => {
            if (returned) {
                // ignore any additional responses, already done
                return;
            }
            returned = true;
            if (typeof done === 'function') {
                if (err) {
                    return done(err);
                }
                return done(null, {
                    envelope,
                    messageId,
                    response: 'Messages queued for delivery'
                });
            }
        };
        let sendmail;
        try {
            sendmail = this._spawn(this.path, args);
        }
        catch (E) {
            this.logger.error({
                err: E,
                tnx: 'spawn',
                messageId
            }, 'Error occurred while spawning sendmail. %s', E.message);
            return callback(E);
        }
        if (sendmail) {
            sendmail.on('error', err => {
                this.logger.error({
                    err,
                    tnx: 'spawn',
                    messageId
                }, 'Error occurred when sending message %s. %s', messageId, err.message);
                callback(err);
            });
            sendmail.once('exit', code => {
                if (!code) {
                    return callback();
                }
                const err = new Error(code === 127 ? 'Sendmail command not found, process exited with code ' + code : 'Sendmail exited with code ' + code);
                err.code = errors.ESENDMAIL;
                this.logger.error({
                    err,
                    tnx: 'stdin',
                    messageId
                }, 'Error sending message %s to sendmail. %s', messageId, err.message);
                callback(err);
            });
            // the close listener is handed the exit code as its first argument, so a non-zero
            // code reaching it before the exit listener did counts as the error value
            sendmail.once('close', callback);
            sendmail.stdin.on('error', err => {
                this.logger.error({
                    err,
                    tnx: 'stdin',
                    messageId
                }, 'Error occurred when piping message %s to sendmail. %s', messageId, err.message);
                callback(err);
            });
            const recipients = [].concat(envelope.to || []);
            if (recipients.length > 3) {
                recipients.push('...and ' + recipients.splice(2).length + ' more');
            }
            this.logger.info({
                tnx: 'send',
                messageId
            }, 'Sending message %s to <%s>', messageId, recipients.join(', '));
            const sourceStream = mail.message.createReadStream();
            let stream = sourceStream;
            if (this.options.newline) {
                // apply the transport-level line ending transform; the message-level
                // `newline` option is handled by MimeNode in createReadStream()
                stream = sourceStream.pipe(this.winbreak ? new le_windows_js_1.default() : new le_unix_js_1.default());
                sourceStream.once('error', err => stream.emit('error', err));
            }
            stream.once('error', err => {
                this.logger.error({
                    err,
                    tnx: 'stdin',
                    messageId
                }, 'Error occurred when generating message %s. %s', messageId, err.message);
                sendmail.kill('SIGINT'); // do not deliver the message
                callback(err);
            });
            stream.pipe(sendmail.stdin);
        }
        else {
            const err = new Error('sendmail was not found');
            err.code = errors.ESENDMAIL;
            return callback(err);
        }
    }
}
exports["default"] = SendmailTransport;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 8013:
/***/ (function(module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const node_events_1 = __importDefault(__nccwpck_require__(8474));
const packageData = __importStar(__nccwpck_require__(5552));
const shared = __importStar(__nccwpck_require__(9893));
const errors = __importStar(__nccwpck_require__(932));
const le_windows_js_1 = __importDefault(__nccwpck_require__(7636));
const index_js_1 = __importDefault(__nccwpck_require__(1915));
/**
 * Tags AWS SDK rejections that carry no `code` property (SDK v3 errors only
 * have a `name`) with the generic SES transport error code, keeping the
 * original error object intact
 */
function tagSesError(err) {
    if (err && typeof err === 'object' && !err.code) {
        err.code = errors.ESES;
    }
    return err;
}
/**
 * Generates a Transport object for AWS SES
 *
 * @constructor
 * @param optional config parameter
 */
class SESTransport extends node_events_1.default {
    constructor(options) {
        super();
        options = options || {};
        this.options = options;
        this.ses = this.options.SES;
        this.name = 'SESTransport';
        this.version = packageData.version;
        this.logger = shared.getLogger(this.options, {
            component: this.options.component || 'ses-transport'
        });
    }
    getRegion(cb) {
        if (this.ses.sesClient.config && typeof this.ses.sesClient.config.region === 'function') {
            // Resolve the region provider. Use the two-argument form of then() so that a
            // synchronous throw from cb is not recaught here and used to invoke cb a second time.
            this.ses.sesClient.config.region().then(region => cb(null, region), err => cb(err));
            return;
        }
        return cb(null, false);
    }
    /**
     * Compiles a mailcomposer message and forwards it to SES
     *
     * @param mail MailComposer object
     * @param callback Callback function to run when the sending is completed
     */
    send(mail, callback) {
        // send() runs after the message was compiled, so mail.message is set
        let fromHeader = mail.message._headers.find(header => /^from$/i.test(header.key));
        if (fromHeader) {
            const mimeNode = new index_js_1.default('text/plain');
            fromHeader = mimeNode._convertAddresses(mimeNode._parseAddresses(fromHeader.value));
        }
        const envelope = mail.message.getEnvelope();
        const messageId = mail.message.messageId();
        const recipients = [].concat(envelope.to || []);
        if (recipients.length > 3) {
            recipients.push('...and ' + recipients.splice(2).length + ' more');
        }
        this.logger.info({
            tnx: 'send',
            messageId
        }, 'Sending message %s to <%s>', messageId, recipients.join(', '));
        const getRawMessage = (next) => {
            // do not use Message-ID and Date in DKIM signature
            if (!mail.data._dkim) {
                mail.data._dkim = {};
            }
            if (mail.data._dkim.skipFields && typeof mail.data._dkim.skipFields === 'string') {
                mail.data._dkim.skipFields += ':date:message-id';
            }
            else {
                mail.data._dkim.skipFields = 'date:message-id';
            }
            const sourceStream = mail.message.createReadStream();
            const stream = sourceStream.pipe(new le_windows_js_1.default());
            const chunks = [];
            let chunklen = 0;
            stream.on('readable', () => {
                let chunk;
                while ((chunk = stream.read()) !== null) {
                    chunks.push(chunk);
                    chunklen += chunk.length;
                }
            });
            sourceStream.once('error', err => stream.emit('error', err));
            stream.once('error', err => next(err));
            stream.once('end', () => next(null, Buffer.concat(chunks, chunklen)));
        };
        setImmediate(() => getRawMessage((err, raw) => {
            if (err) {
                this.logger.error({
                    err,
                    tnx: 'send',
                    messageId
                }, 'Failed creating message for %s. %s', messageId, err.message);
                return callback(err);
            }
            // mail.data.ses is caller supplied message data, so copy its own keys only
            const sesMessage = shared.copyOwnKeys({
                Content: {
                    Raw: {
                        // required
                        Data: raw // required
                    }
                },
                FromEmailAddress: fromHeader || envelope.from,
                Destination: {
                    ToAddresses: envelope.to
                }
            }, mail.data.ses);
            this.getRegion((err, region) => {
                if (err || !region) {
                    region = 'us-east-1';
                }
                let sendPromise;
                try {
                    // command construction or dispatch can throw synchronously on a
                    // misconfigured SDK; surface it as a single error callback instead
                    // of letting it escape into getRegion's promise chain
                    const command = new this.ses.SendEmailCommand(sesMessage);
                    sendPromise = this.ses.sesClient.send(command);
                }
                catch (err) {
                    tagSesError(err);
                    this.logger.error({
                        err,
                        tnx: 'send'
                    }, 'Send error for %s: %s', messageId, err.message);
                    setImmediate(() => callback(err));
                    return;
                }
                sendPromise
                    .then(data => {
                    if (region === 'us-east-1') {
                        region = 'email';
                    }
                    const info = {
                        envelope: {
                            from: envelope.from,
                            to: envelope.to
                        },
                        messageId: '<' + data.MessageId + (!/@/.test(data.MessageId) ? '@' + region + '.amazonses.com' : '') + '>',
                        response: data.MessageId,
                        raw: raw
                    };
                    // invoke the callback outside the promise chain so a throw from it
                    // is not recaught by .catch() and used to call it a second time
                    setImmediate(() => callback(null, info));
                })
                    .catch(err => {
                    tagSesError(err);
                    this.logger.error({
                        err,
                        tnx: 'send'
                    }, 'Send error for %s: %s', messageId, err.message);
                    setImmediate(() => callback(err));
                });
            });
        }));
    }
    verify(callback) {
        let promise;
        if (!callback) {
            promise = new Promise((resolve, reject) => {
                callback = shared.callbackPromise(resolve, reject);
            });
        }
        const done = callback;
        const cb = (err) => {
            if (err && !['InvalidParameterValue', 'MessageRejected'].includes(err.code || err.Code || err.name)) {
                return done(tagSesError(err));
            }
            return done(null, true);
        };
        const sesMessage = {
            Content: {
                Raw: {
                    Data: Buffer.from('From: <invalid@invalid>\r\nTo: <invalid@invalid>\r\n Subject: Invalid\r\n\r\nInvalid')
                }
            },
            FromEmailAddress: 'invalid@invalid',
            Destination: {
                ToAddresses: ['invalid@invalid']
            }
        };
        // the region value is not used for anything when verifying, but the lookup
        // exercises the client configuration the same way as send() does
        this.getRegion(() => {
            let sendPromise;
            try {
                const command = new this.ses.SendEmailCommand(sesMessage);
                sendPromise = this.ses.sesClient.send(command);
            }
            catch (err) {
                setImmediate(() => cb(err));
                return;
            }
            sendPromise.then(() => setImmediate(() => cb(null))).catch(err => setImmediate(() => cb(err)));
        });
        return promise;
    }
}
exports["default"] = SESTransport;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 9893:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


/* eslint no-console: 0 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.encodeXText = exports.assign = exports.parseDataURI = exports.callbackPromise = exports.getLogger = exports._logFunc = exports.parseConnectionUrl = exports.resolveHostname = exports.dnsCache = exports.networkInterfaces = exports._resetCacheCleanup = exports._lastCacheCleanup = exports.copyOwnKeys = exports.isProtoKey = void 0;
exports.resolveContent = resolveContent;
const urllib = __importStar(__nccwpck_require__(2452));
const node_util_1 = __importDefault(__nccwpck_require__(7975));
const node_fs_1 = __importDefault(__nccwpck_require__(3024));
const index_js_1 = __importDefault(__nccwpck_require__(7336));
const errors = __importStar(__nccwpck_require__(932));
const objects_js_1 = __nccwpck_require__(6477);
Object.defineProperty(exports, "isProtoKey", ({ enumerable: true, get: function () { return objects_js_1.isProtoKey; } }));
Object.defineProperty(exports, "copyOwnKeys", ({ enumerable: true, get: function () { return objects_js_1.copyOwnKeys; } }));
const node_dns_1 = __importDefault(__nccwpck_require__(610));
const node_net_1 = __importDefault(__nccwpck_require__(7030));
const node_os_1 = __importDefault(__nccwpck_require__(8161));
const DNS_TTL = 5 * 60 * 1000;
const CACHE_CLEANUP_INTERVAL = 30 * 1000; // Minimum 30 seconds between cleanups
const MAX_CACHE_SIZE = 1000; // Maximum number of entries in cache
let lastCacheCleanup = 0;
const _lastCacheCleanup = () => lastCacheCleanup;
exports._lastCacheCleanup = _lastCacheCleanup;
const _resetCacheCleanup = () => {
    lastCacheCleanup = 0;
};
exports._resetCacheCleanup = _resetCacheCleanup;
try {
    exports.networkInterfaces = node_os_1.default.networkInterfaces();
}
catch (_err) {
    // fails on some systems
}
const isFamilySupported = (family, allowInternal) => {
    const addresses = Object.values(exports.networkInterfaces || {}).flat();
    if (!addresses.length) {
        // hope for the best. Runtimes without an interface table (Cloudflare
        // Workers) report an empty object rather than throwing
        return true;
    }
    return addresses.filter(i => !i.internal || allowInternal).some(i => i.family === 'IPv' + family || i.family === family);
};
const resolve = (family, hostname, options, callback) => {
    options = options || {};
    if (!isFamilySupported(family, options.allowInternalNetworkInterfaces)) {
        return callback(null, []);
    }
    const dnsResolver = node_dns_1.default.Resolver ? new node_dns_1.default.Resolver(options) : node_dns_1.default;
    dnsResolver['resolve' + family](hostname, (err, addresses) => {
        if (err) {
            switch (err.code) {
                case node_dns_1.default.NODATA:
                case node_dns_1.default.NOTFOUND:
                case node_dns_1.default.NOTIMP:
                case node_dns_1.default.SERVFAIL:
                case node_dns_1.default.CONNREFUSED:
                case node_dns_1.default.REFUSED:
                case 'EAI_AGAIN':
                    return callback(null, []);
            }
            return callback(err);
        }
        return callback(null, Array.isArray(addresses) ? addresses : [].concat(addresses || []));
    });
};
exports.dnsCache = new Map();
const formatDNSValue = (value, extra) => {
    if (!value) {
        return Object.assign({}, extra || {});
    }
    const addresses = value.addresses || [];
    // Select a random address from available addresses, or null if none
    const host = addresses.length > 0 ? addresses[Math.floor(Math.random() * addresses.length)] : null;
    return Object.assign({
        servername: value.servername,
        host,
        // Include all addresses for connection fallback support
        _addresses: addresses
    }, extra || {});
};
const resolveHostname = (options, callback) => {
    options = options || {};
    if (!options.host && options.servername) {
        options.host = options.servername;
    }
    if (!options.host || node_net_1.default.isIP(options.host)) {
        // nothing to do here
        const value = {
            addresses: [options.host],
            servername: options.servername || false
        };
        return callback(null, formatDNSValue(value, {
            cached: false
        }));
    }
    const host = options.host;
    let cached;
    if (exports.dnsCache.has(options.host)) {
        cached = exports.dnsCache.get(options.host);
        // Lazy cleanup with time throttling
        const now = Date.now();
        if (now - lastCacheCleanup > CACHE_CLEANUP_INTERVAL) {
            lastCacheCleanup = now;
            // Clean up expired entries
            for (const [host, entry] of exports.dnsCache.entries()) {
                if (entry.expires && entry.expires < now) {
                    exports.dnsCache.delete(host);
                }
            }
            // If cache is still too large, remove oldest entries
            if (exports.dnsCache.size > MAX_CACHE_SIZE) {
                const toDelete = Math.floor(MAX_CACHE_SIZE * 0.1); // Remove 10% of entries
                const keys = Array.from(exports.dnsCache.keys()).slice(0, toDelete);
                keys.forEach(key => exports.dnsCache.delete(key));
            }
        }
        if (!cached.expires || cached.expires >= now) {
            return callback(null, formatDNSValue(cached.value, {
                cached: true
            }));
        }
    }
    // Resolve both IPv4 and IPv6 addresses for fallback support
    let ipv4Addresses = [];
    let ipv6Addresses = [];
    let ipv4Error = null;
    let ipv6Error = null;
    resolve(4, options.host, options, (err, addresses) => {
        if (err) {
            ipv4Error = err;
        }
        else {
            ipv4Addresses = addresses || [];
        }
        resolve(6, host, options, (err, addresses) => {
            if (err) {
                ipv6Error = err;
            }
            else {
                ipv6Addresses = addresses || [];
            }
            // Combine addresses: IPv4 first, then IPv6
            const allAddresses = ipv4Addresses.concat(ipv6Addresses);
            if (allAddresses.length) {
                const value = {
                    addresses: allAddresses,
                    servername: options.servername || host
                };
                exports.dnsCache.set(host, {
                    value,
                    expires: Date.now() + (options.dnsTtl || DNS_TTL)
                });
                return callback(null, formatDNSValue(value, {
                    cached: false
                }));
            }
            // No addresses from resolve4/resolve6, try dns.lookup as fallback
            if (ipv4Error && ipv6Error) {
                // Both resolvers had errors
                if (cached) {
                    exports.dnsCache.set(host, {
                        value: cached.value,
                        expires: Date.now() + (options.dnsTtl || DNS_TTL)
                    });
                    return callback(null, formatDNSValue(cached.value, {
                        cached: true,
                        error: ipv4Error
                    }));
                }
            }
            try {
                node_dns_1.default.lookup(host, { all: true }, (err, addresses) => {
                    if (err) {
                        if (cached) {
                            exports.dnsCache.set(host, {
                                value: cached.value,
                                expires: Date.now() + (options.dnsTtl || DNS_TTL)
                            });
                            return callback(null, formatDNSValue(cached.value, {
                                cached: true,
                                error: err
                            }));
                        }
                        return callback(err);
                    }
                    // Get all supported addresses from dns.lookup
                    const supportedAddresses = addresses
                        ? addresses.filter(addr => isFamilySupported(addr.family)).map(addr => addr.address)
                        : [];
                    if (addresses && addresses.length && !supportedAddresses.length) {
                        // there are addresses but none can be used
                        console.warn(`Failed to resolve IPv${addresses[0].family} addresses with current network`);
                    }
                    if (!supportedAddresses.length && cached) {
                        // nothing was found, fallback to cached value
                        return callback(null, formatDNSValue(cached.value, {
                            cached: true
                        }));
                    }
                    const value = {
                        addresses: supportedAddresses.length ? supportedAddresses : [host],
                        servername: options.servername || host
                    };
                    exports.dnsCache.set(host, {
                        value,
                        expires: Date.now() + (options.dnsTtl || DNS_TTL)
                    });
                    return callback(null, formatDNSValue(value, {
                        cached: false
                    }));
                });
            }
            catch (lookupErr) {
                if (cached) {
                    exports.dnsCache.set(host, {
                        value: cached.value,
                        expires: Date.now() + (options.dnsTtl || DNS_TTL)
                    });
                    return callback(null, formatDNSValue(cached.value, {
                        cached: true,
                        error: lookupErr
                    }));
                }
                return callback(ipv4Error || ipv6Error || lookupErr);
            }
        });
    });
};
exports.resolveHostname = resolveHostname;
/**
 * Parses connection url to a structured configuration object
 *
 * @param str Connection url
 * @return Configuration object
 */
const parseConnectionUrl = (str) => {
    str = str || '';
    const options = {};
    const url = urllib.parse(str, true);
    switch (url.protocol) {
        case 'smtp:':
            options.secure = false;
            break;
        case 'smtps:':
            options.secure = true;
            break;
        case 'direct:':
            options.direct = true;
            break;
    }
    if (!isNaN(url.port) && Number(url.port)) {
        options.port = Number(url.port);
    }
    if (url.hostname) {
        options.host = url.hostname;
    }
    if (url.username || url.password) {
        options.auth = {
            user: url.username || '',
            pass: url.password || ''
        };
    }
    Object.keys(url.query || {}).forEach(key => {
        let obj = options;
        let lKey = key;
        let value = url.query[key];
        if (!isNaN(value)) {
            value = Number(value);
        }
        switch (value) {
            case 'true':
                value = true;
                break;
            case 'false':
                value = false;
                break;
        }
        // tls is nested object
        if (key.indexOf('tls.') === 0) {
            lKey = key.substr(4);
            if (!options.tls) {
                options.tls = {};
            }
            obj = options.tls;
        }
        else if (key.indexOf('.') >= 0) {
            // ignore nested properties besides tls
            return;
        }
        // `in` already keeps "__proto__" out, but only as a side effect of it being an
        // Object.prototype member. Say it, so the protection survives a change to the check
        if (!(0, objects_js_1.isProtoKey)(lKey) && !(lKey in obj)) {
            obj[lKey] = value;
        }
    });
    return options;
};
exports.parseConnectionUrl = parseConnectionUrl;
const _logFunc = (logger, level, defaults, data, message, ...args) => {
    const entry = Object.assign({}, defaults || {}, data || {});
    delete entry.level;
    let logLevel = level;
    if (typeof logger[logLevel] !== 'function') {
        // Provided logger does not implement this level. Fall back to a
        // lower-severity handler instead of throwing.
        logLevel = ['info', 'debug', 'log', 'trace', 'warn', 'error'].find(name => typeof logger[name] === 'function');
    }
    if (logLevel) {
        logger[logLevel](entry, message, ...args);
    }
};
exports._logFunc = _logFunc;
/**
 * Returns a bunyan-compatible logger interface. Uses either provided logger or
 * creates a default console logger
 *
 * @param [options] Options object that might include 'logger' value
 * @return bunyan compatible logger
 */
const getLogger = (options, defaults) => {
    options = options || {};
    const response = {};
    const levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
    if (!options.logger) {
        // use vanity logger
        levels.forEach(level => {
            response[level] = () => false;
        });
        return response;
    }
    const logger = options.logger === true ? createDefaultLogger(levels) : options.logger;
    levels.forEach(level => {
        response[level] = (data, message, ...args) => {
            (0, exports._logFunc)(logger, level, defaults, data, message, ...args);
        };
    });
    return response;
};
exports.getLogger = getLogger;
/**
 * Wrapper for creating a callback that either resolves or rejects a promise
 * based on input
 *
 * @param resolve Function to run if callback is called
 * @param reject Function to run if callback ends with an error
 */
const callbackPromise = (resolve, reject) => function (...args) {
    const err = args.shift();
    if (err) {
        reject(err);
    }
    else {
        resolve(...args);
    }
};
exports.callbackPromise = callbackPromise;
const parseDataURI = (uri) => {
    if (typeof uri !== 'string') {
        return null;
    }
    // Early return for non-data URIs to avoid unnecessary processing
    if (!uri.startsWith('data:')) {
        return null;
    }
    // Find the first comma safely - this prevents ReDoS
    const commaPos = uri.indexOf(',');
    if (commaPos === -1) {
        return null;
    }
    const data = uri.substring(commaPos + 1);
    const metaStr = uri.substring('data:'.length, commaPos);
    let encoding;
    const metaEntries = metaStr.split(';');
    if (metaEntries.length > 0) {
        const lastEntry = metaEntries[metaEntries.length - 1].toLowerCase().trim();
        // Only recognize valid encoding types to prevent manipulation
        if (['base64', 'utf8', 'utf-8'].includes(lastEntry) && lastEntry.indexOf('=') === -1) {
            encoding = lastEntry;
            metaEntries.pop();
        }
    }
    const contentType = metaEntries.length > 0 ? metaEntries.shift() : 'application/octet-stream';
    const params = {};
    for (let i = 0; i < metaEntries.length; i++) {
        const entry = metaEntries[i];
        const sepPos = entry.indexOf('=');
        if (sepPos > 0) {
            // Ensure there's a key before the '='
            const key = entry.substring(0, sepPos).trim();
            const value = entry.substring(sepPos + 1).trim();
            if (key && !(0, objects_js_1.isProtoKey)(key)) {
                params[key] = value;
            }
        }
    }
    // Decode data based on encoding with proper error handling
    let bufferData;
    try {
        if (encoding === 'base64') {
            bufferData = Buffer.from(data, 'base64');
        }
        else {
            try {
                bufferData = Buffer.from(decodeURIComponent(data));
            }
            catch (_decodeError) {
                bufferData = Buffer.from(data);
            }
        }
    }
    catch (_bufferError) {
        bufferData = Buffer.alloc(0);
    }
    return {
        data: bufferData,
        encoding: encoding || null,
        contentType: contentType || 'application/octet-stream',
        params
    };
};
exports.parseDataURI = parseDataURI;
function resolveContent(data, key, options, callback) {
    // options is optional; support the legacy resolveContent(data, key, callback) signature
    if (!callback && typeof options === 'function') {
        callback = options;
        options = false;
    }
    options = options || {};
    let promise;
    if (!callback) {
        promise = new Promise((resolve, reject) => {
            callback = (0, exports.callbackPromise)(resolve, reject);
        });
    }
    resolveContentValue(data, key, options, callback);
    return promise;
}
function resolveContentValue(data, key, options, callback) {
    let content = (data && data[key] && data[key].content) || data[key];
    const encoding = ((typeof data[key] === 'object' && data[key].encoding) || 'utf8')
        .toString()
        .toLowerCase()
        .replace(/[-_\s]/g, '');
    if (!content) {
        return callback(null, content);
    }
    if (typeof content === 'object') {
        if (typeof content.pipe === 'function') {
            return resolveStream(content, (err, value) => {
                if (err) {
                    return callback(err);
                }
                // we can't stream twice the same content, so we need
                // to replace the stream object with the streaming result
                if (data[key].content) {
                    data[key].content = value;
                }
                else {
                    data[key] = value;
                }
                callback(null, value);
            });
        }
        else if (/^data:/i.test(content.path || content.href)) {
            const parsedDataUri = (0, exports.parseDataURI)(content.path || content.href);
            return callback(null, parsedDataUri && parsedDataUri.data ? parsedDataUri.data : Buffer.alloc(0));
        }
        else if (content.href || /^https?:\/\//i.test(content.path)) {
            // An href is always a URL, and so is a path that looks like one. Let nmfetch
            // decide whether it is fetchable, it validates the parsed URL. Testing the raw
            // string here instead would let a file: href fall through to the "return as is"
            // default below and travel on inside the resolved message.
            const url = content.href || content.path;
            if (options.disableUrlAccess) {
                setImmediate(() => {
                    const err = new Error('Url access rejected for ' + url);
                    err.code = errors.EURLACCESS;
                    callback(err);
                });
                return;
            }
            return resolveStream((0, index_js_1.default)(url, { headers: content.httpHeaders, tls: content.tls }), callback);
        }
        else if (content.path) {
            if (options.disableFileAccess) {
                setImmediate(() => {
                    const err = new Error('File access rejected for ' + content.path);
                    err.code = errors.EFILEACCESS;
                    callback(err);
                });
                return;
            }
            return resolveStream(node_fs_1.default.createReadStream(content.path), callback);
        }
    }
    if (typeof data[key].content === 'string' && !['utf8', 'usascii', 'ascii'].includes(encoding)) {
        content = Buffer.from(data[key].content, encoding);
    }
    // default action, return as is
    setImmediate(() => callback(null, content));
}
/**
 * Copies properties from source objects to target objects
 */
const assign = function (...args) {
    const target = args.shift() || {};
    args.forEach(source => {
        Object.keys(source || {}).forEach(key => {
            if ((0, objects_js_1.isProtoKey)(key)) {
                return;
            }
            if (['tls', 'auth'].includes(key) &&
                source[key] &&
                typeof source[key] === 'object') {
                // tls and auth are special keys that need to be enumerated separately
                // other objects are passed as is. Enumerating is a copy of user supplied
                // keys just like the loop above, so it gets the same treatment
                target[key] = (0, objects_js_1.copyOwnKeys)(target[key] || {}, source[key]);
            }
            else {
                target[key] = source[key];
            }
        });
    });
    return target;
};
exports.assign = assign;
const encodeXText = (str) => {
    // ! 0x21
    // + 0x2B
    // = 0x3D
    // ~ 0x7E
    if (!/[^\x21-\x2A\x2C-\x3C\x3E-\x7E]/.test(str)) {
        return str;
    }
    const buf = Buffer.from(str);
    let result = '';
    for (let i = 0, len = buf.length; i < len; i++) {
        const c = buf[i];
        if (c < 0x21 || c > 0x7e || c === 0x2b || c === 0x3d) {
            result += '+' + (c < 0x10 ? '0' : '') + c.toString(16).toUpperCase();
        }
        else {
            result += String.fromCharCode(c);
        }
    }
    return result;
};
exports.encodeXText = encodeXText;
/**
 * Streams a stream value into a Buffer
 *
 * @param stream Readable stream
 * @param callback Callback function with (err, value)
 */
function resolveStream(stream, callback) {
    let responded = false;
    const chunks = [];
    let chunklen = 0;
    stream.on('error', err => {
        if (responded) {
            return;
        }
        responded = true;
        callback(err);
    });
    stream.on('readable', () => {
        let chunk;
        while ((chunk = stream.read()) !== null) {
            chunks.push(chunk);
            chunklen += chunk.length;
        }
    });
    stream.on('end', () => {
        if (responded) {
            return;
        }
        responded = true;
        let value;
        try {
            value = Buffer.concat(chunks, chunklen);
        }
        catch (E) {
            return callback(E);
        }
        callback(null, value);
    });
}
/**
 * Generates a bunyan-like logger that prints to console
 *
 * @returns Bunyan logger instance
 */
function createDefaultLogger(levels) {
    const levelMaxLen = levels.reduce((max, level) => Math.max(max, level.length), 0);
    const levelNames = new Map();
    levels.forEach(level => {
        let levelName = level.toUpperCase();
        if (levelName.length < levelMaxLen) {
            levelName += ' '.repeat(levelMaxLen - levelName.length);
        }
        levelNames.set(level, levelName);
    });
    const print = (level, entry, message, ...args) => {
        let prefix = '';
        if (entry) {
            if (entry.tnx === 'server') {
                prefix = 'S: ';
            }
            else if (entry.tnx === 'client') {
                prefix = 'C: ';
            }
            if (entry.sid) {
                prefix = '[' + entry.sid + '] ' + prefix;
            }
            if (entry.cid) {
                prefix = '[#' + entry.cid + '] ' + prefix;
            }
        }
        message = node_util_1.default.format(message, ...args);
        message.split(/\r?\n/).forEach((line) => {
            console.log('[%s] %s %s', new Date().toISOString().substr(0, 19).replace(/T/, ' '), levelNames.get(level), prefix + line);
        });
    };
    const logger = {};
    levels.forEach(level => {
        logger[level] = print.bind(null, level);
    });
    return logger;
}


/***/ }),

/***/ 6477:
/***/ ((__unused_webpack_module, exports) => {


// Safe copying of objects whose keys come from the caller.
//
// This lives in its own leaf module, like ./url.ts, so that every layer can reach it.
// src/shared/index.ts imports src/fetch, so src/fetch can not import src/shared back,
// and src/mime-funcs is a leaf that would otherwise pull in dns/net/os/fs for a string
// comparison. src/shared/index.ts re-exports both functions for the callers that already
// depend on it.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.copyOwnKeys = exports.isProtoKey = void 0;
/**
 * Detects a key that can not be copied onto a plain object with `target[key] = value`.
 *
 * "__proto__" is the only one: assigning it runs the inherited setter and replaces the
 * prototype of the target instead of adding a property to it, so a caller can smuggle
 * values past validation that only inspects own keys. JSON.parse produces such a key
 * where an object literal can not. "constructor" and "prototype" have no such setter and
 * become ordinary own properties, so dropping them would only discard legitimate values.
 *
 * @param key Key to check
 * @returns true if the key must not be copied
 */
const isProtoKey = (key) => key === '__proto__';
exports.isProtoKey = isProtoKey;
/**
 * Copies own enumerable keys from a source object to a target object. Every copy that
 * walks the keys of user supplied data goes through here, see isProtoKey.
 *
 * @param target Object to copy the keys to
 * @param source Object to copy the keys from
 * @param [skip] Optional predicate, return true to leave a key out
 * @returns The target object
 */
const copyOwnKeys = (target, source, skip) => {
    Object.keys(source || {}).forEach(key => {
        if ((0, exports.isProtoKey)(key) || (skip && skip(key))) {
            return;
        }
        target[key] = source[key];
    });
    return target;
};
exports.copyOwnKeys = copyOwnKeys;


/***/ }),

/***/ 2452:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


// URL parsing wrapper around the WHATWG `URL` class. It only falls back to the
// legacy, deprecation-warning-emitting `url.parse()` / `url.resolve()` for input
// the WHATWG parser rejects.
//
// The WHATWG `URL` exposes a different shape than the legacy parser, so results
// are normalized back into the legacy field names the rest of the codebase reads
// (`protocol`, `hostname`, `port`, `pathname`, `path`, `search`, `auth`, `query`,
// `href`). This keeps every existing call site unchanged.
//
// Known, accepted divergences from the legacy parser:
//  - non-special schemes (smtp:/smtps:/direct:) are not host-lowercased by
//    WHATWG; cosmetic only, SMTP/DNS hosts are case-insensitive. (IDNA mapping
//    and IPv6 brackets are normalized back by normalizeHostname below.)
//  - a literal unescaped ':' inside a password is percent-encoded by WHATWG;
//    such passwords should be percent-encoded by the caller anyway.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolve = exports.parse = void 0;
const node_net_1 = __importDefault(__nccwpck_require__(7030));
const node_url_1 = __importDefault(__nccwpck_require__(3136));
const punycode = __importStar(__nccwpck_require__(111));
// Matches a "scheme:" not followed by "//" (and with something after it), used
// to re-insert the authority separator the legacy parser did not require.
const SLASHLESS_AUTHORITY = /^([a-zA-Z][a-zA-Z0-9+.-]*:)(?!\/\/)([\s\S]+)$/;
// Leading and trailing C0 controls and spaces, which the WHATWG parser strips before it
// looks at the input. Stripped up front so that the slash-less form is recognized in a
// value read from a file with a trailing newline as well.
const SURROUNDING_WHITESPACE = /^[\x00-\x20]+|[\x00-\x20]+$/g;
// Leading characters legacy url.parse() skips before it reads the scheme
const LEGACY_TRIM = /^[\x00-\x20\u00a0\ufeff]+/;
// The authority of a "scheme://authority/..." or a scheme-relative "//authority/..."
// string: the scheme, if any (anything the legacy parser takes for one, it is less strict
// than WHATWG about the first character), and what the legacy parser has to report as the
// host once the userinfo is removed, see legacyParse. The legacy parser treats a backslash
// as a slash.
const AUTHORITY = /^([a-zA-Z0-9+.-]+:)?[\\/]{2}([^\\/?#]*)/;
// The WHATWG forbidden domain code points, except '%' which an opaque host may carry: the
// C0 control characters, space, DEL and the URL delimiters. CONTROL_CHARS is the C0 and DEL
// subset, checked on its own in legacyParse where the host string still carries the port
// and IPv6 brackets.
const FORBIDDEN_HOST_CHARS = /[\x00-\x20#/:<>?@[\\\]^|\x7f]/;
const CONTROL_CHARS = /[\x00-\x1f\x7f]/;
// The error the WHATWG parser throws, for a host that only fails the checks in this module
function invalidUrl(input) {
    const err = new TypeError('Invalid URL');
    err.code = 'ERR_INVALID_URL';
    err.input = input;
    return err;
}
// Legacy url.parse() for input the WHATWG parser refused. The legacy parser does not
// reject a host it can not represent: a NUL byte, a percent-encoded byte, a space or a
// '<' inside the host ends the host early and the rest becomes the path, so
// 'localhost%00.example.com' silently turns into a request to 'localhost'. When the
// input has an authority that the legacy parser reads as the host (always for
// "scheme://", for "//host" only when slashesDenoteHost is set, as url.resolve() does
// for its target), the legacy result is accepted only if that host is the whole written
// authority, lowercased and IDNA mapped the way the legacy parser does it, and carries
// no control character. A legacy result with a host (an empty one included, 'http:///x'
// is a request to localhost) that no such authority accounts for is refused as well.
// Otherwise the WHATWG error is reported. Relative input has no authority to check and
// keeps the legacy behavior.
function legacyParse(input, parseQueryString, whatwgError, slashesDenoteHost) {
    const parsed = node_url_1.default.parse(input, parseQueryString, slashesDenoteHost);
    const authority = AUTHORITY.exec(input.replace(LEGACY_TRIM, ''));
    if (authority && (authority[1] || parsed.hostname !== null)) {
        const written = authority[2].slice(authority[2].lastIndexOf('@') + 1);
        if (!written || CONTROL_CHARS.test(written) || (parsed.host || '').toLowerCase() !== punycode.toASCII(written.toLowerCase())) {
            throw whatwgError;
        }
        // the legacy parser takes any bracketed value for an IPv6 literal
        if (written.charAt(0) === '[' && !node_net_1.default.isIPv6(written.slice(1, written.indexOf(']')))) {
            throw whatwgError;
        }
    }
    else if (parsed.hostname !== null) {
        throw whatwgError;
    }
    // the legacy parser only offers the joined form, split it on the first colon
    const legacyAuth = parsed.auth === null || parsed.auth === undefined ? null : parsed.auth.split(':');
    const result = parsed;
    result.username = legacyAuth ? legacyAuth.shift() : null;
    result.password = legacyAuth && legacyAuth.length ? legacyAuth.join(':') : null;
    return result;
}
// decodeURIComponent that never throws. Legacy url.parse() decodes the auth
// component but tolerates malformed percent sequences, so mirror that.
function safeDecode(str) {
    try {
        return decodeURIComponent(str);
    }
    catch (_err) {
        return str;
    }
}
// Derives the legacy-shaped bare hostname from a WHATWG URL. WHATWG keeps IPv6
// literals bracketed ('[::1]') and, for non-special schemes (smtp:/smtps:/socks:),
// percent-encodes a non-ASCII host instead of IDNA-mapping it. Both forms are
// un-resolvable when handed to net/dns/http.request, which is what every call
// site does, so map them back to what legacy url.parse() returned: the bare
// address and the IDNA mapped (lowercased, punycode) form. Idempotent on plain
// ASCII and already-punycode hosts, so special-scheme hosts (already IDNA-mapped
// by WHATWG) pass through.
function normalizeHostname(raw, href) {
    const hostname = raw || '';
    if (!hostname) {
        // Host-less URL (e.g. 'direct:'): legacy returned '' here, not null;
        // consumers do `hostname.length` / `'.' + hostname`, so keep it a string.
        return '';
    }
    if (hostname.charAt(0) === '[' && hostname.charAt(hostname.length - 1) === ']') {
        return hostname.slice(1, -1);
    }
    const decoded = safeDecode(hostname);
    // domainToASCII applies the WHATWG host rules (IDNA mapping included) and returns an
    // empty string for a host it refuses, the forbidden characters among them
    const mapped = FORBIDDEN_HOST_CHARS.test(decoded) ? '' : node_url_1.default.domainToASCII(decoded);
    if (!mapped) {
        throw invalidUrl(href);
    }
    return mapped;
}
const parse = (input, parseQueryString) => {
    input = (input || '').replace(SURROUNDING_WHITESPACE, '');
    // Legacy url.parse() parses a "user:pass@host:port" authority that follows
    // the scheme even without the "//" separator, for schemes outside its
    // built-in slashed-protocol list (smtp:/smtps:/socks:/...). The WHATWG
    // parser instead treats a scheme not followed by "//" as an opaque path.
    // Re-insert the "//" so slash-less connection/proxy URLs keep resolving to
    // an authority, as they did before. This assumes a slash-authority scheme,
    // which every consumer here uses (http/https/smtp/smtps/socks/direct); an
    // opaque scheme like mailto:/data:/tel: would be mis-split, but none reach
    // this module.
    const slashless = SLASHLESS_AUTHORITY.exec(input);
    const normalized = slashless ? slashless[1] + '//' + slashless[2] : input;
    let u;
    try {
        u = new URL(normalized);
    }
    catch (err) {
        // WHATWG rejects some input the legacy parser tolerated (empty/relative
        // strings, scheme-relative '//host/path', out-of-range ports, ...). Fall
        // back to the legacy parser so behavior, including the downstream errors
        // callers rely on, is preserved. This is the only path that can still
        // emit a deprecation warning; it fires for anything WHATWG cannot
        // represent, including legitimate relative URLs, not just malformed input.
        return legacyParse(normalized, parseQueryString, err);
    }
    const hostname = normalizeHostname(u.hostname, u.href);
    const port = u.port || null;
    const pathname = u.pathname || null;
    const search = u.search || null;
    // Legacy `.auth` is the decoded "user[:pass]" string; WHATWG keeps the
    // username/password percent-encoded, so decode to stay byte-compatible with
    // existing consumers (parseConnectionUrl, Basic/Proxy-Authorization headers).
    let auth = null;
    let username = null;
    let password = null;
    if (u.username || u.password) {
        // Gate on password too: legacy url.parse('smtps://:pass@host').auth was
        // ':pass'. Dropping it would silently connect unauthenticated.
        username = safeDecode(u.username);
        password = u.password ? safeDecode(u.password) : null;
        // the joined form is ambiguous once the user name contains a colon, so
        // consumers that need the parts read username and password instead
        auth = username + (password !== null ? ':' + password : '');
    }
    let query;
    if (parseQueryString) {
        // Mirror querystring.parse(): null-prototype object, repeated keys become an array.
        const parsed = Object.create(null);
        u.searchParams.forEach((value, key) => {
            if (Object.prototype.hasOwnProperty.call(parsed, key)) {
                const existing = parsed[key];
                if (Array.isArray(existing)) {
                    existing.push(value);
                }
                else {
                    parsed[key] = [existing, value];
                }
            }
            else {
                parsed[key] = value;
            }
        });
        query = parsed;
    }
    else {
        query = search ? search.slice(1) : null;
    }
    return {
        protocol: u.protocol || null,
        host: u.host || null,
        hostname,
        port,
        pathname,
        search,
        path: (pathname || '') + (search || '') || null,
        href: u.href,
        auth,
        username,
        password,
        query
    };
};
exports.parse = parse;
const resolve = (from, to) => {
    try {
        return new URL(to, from).href;
    }
    catch (err) {
        // Malformed target, fall back to the legacy resolver, but only when the legacy
        // parser reads the same host out of both inputs that was written. The target
        // decides the host when it is absolute or scheme-relative, the base otherwise
        legacyParse(from, false, err, true);
        legacyParse(to, false, err, true);
        return node_url_1.default.resolve(from, to);
    }
};
exports.resolve = resolve;


/***/ }),

/***/ 7004:
/***/ ((module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const node_stream_1 = __nccwpck_require__(7075);
/**
 * Escapes dots in the beginning of lines. Ends the stream with <CR><LF>.<CR><LF>
 * Also makes sure that only <CR><LF> sequences are used for linebreaks
 *
 * @param options Stream options
 */
class DataStream extends node_stream_1.Transform {
    constructor(options) {
        super(options);
        this.options = options || {};
        this.inByteCount = 0;
        this.outByteCount = 0;
        this.lastByte = false;
    }
    /**
     * Escapes dots
     */
    _transform(chunk, encoding, done) {
        const chunks = [];
        let chunklen = 0;
        let i, len, lastPos = 0;
        let buf;
        if (!chunk || !chunk.length) {
            return done();
        }
        if (typeof chunk === 'string') {
            chunk = Buffer.from(chunk);
        }
        this.inByteCount += chunk.length;
        for (i = 0, len = chunk.length; i < len; i++) {
            if (chunk[i] === 0x2e) {
                // .
                if ((i && chunk[i - 1] === 0x0a) || (!i && (!this.lastByte || this.lastByte === 0x0a))) {
                    buf = chunk.slice(lastPos, i + 1);
                    chunks.push(buf);
                    chunks.push(Buffer.from('.'));
                    chunklen += buf.length + 1;
                    lastPos = i + 1;
                }
            }
            else if (chunk[i] === 0x0a) {
                // \n
                if ((i && chunk[i - 1] !== 0x0d) || (!i && this.lastByte !== 0x0d)) {
                    if (i > lastPos) {
                        buf = chunk.slice(lastPos, i);
                        chunks.push(buf);
                        chunklen += buf.length + 2;
                    }
                    else {
                        chunklen += 2;
                    }
                    chunks.push(Buffer.from('\r\n'));
                    lastPos = i + 1;
                }
            }
        }
        if (chunklen) {
            // add last piece
            if (lastPos < chunk.length) {
                buf = chunk.slice(lastPos);
                chunks.push(buf);
                chunklen += buf.length;
            }
            this.outByteCount += chunklen;
            this.push(Buffer.concat(chunks, chunklen));
        }
        else {
            this.outByteCount += chunk.length;
            this.push(chunk);
        }
        this.lastByte = chunk[chunk.length - 1];
        done();
    }
    /**
     * Finalizes the stream with a dot on a single line
     */
    _flush(done) {
        let buf;
        if (this.lastByte === 0x0a) {
            buf = Buffer.from('.\r\n');
        }
        else if (this.lastByte === 0x0d) {
            buf = Buffer.from('\n.\r\n');
        }
        else {
            buf = Buffer.from('\r\n.\r\n');
        }
        this.outByteCount += buf.length;
        this.push(buf);
        done();
    }
}
exports["default"] = DataStream;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 416:
/***/ (function(module, exports, __nccwpck_require__) {


/**
 * Minimal HTTP/S proxy client
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const node_net_1 = __importDefault(__nccwpck_require__(7030));
const node_tls_1 = __importDefault(__nccwpck_require__(1692));
const urllib = __importStar(__nccwpck_require__(2452));
const errors = __importStar(__nccwpck_require__(932));
// Cap the CONNECT response we buffer before the header terminator, so a proxy that
// never sends \r\n\r\n cannot grow memory unboundedly before the socket times out.
const MAX_RESPONSE_HEADER_BYTES = 64 * 1024;
function httpProxyClient(proxyUrl, destinationPort, destinationHost, tlsOptions, callback) {
    if (typeof tlsOptions === 'function') {
        callback = tlsOptions;
        tlsOptions = {};
    }
    tlsOptions = tlsOptions || {};
    // Reject CRLF in the destination before it reaches the CONNECT request line
    // and Host header. A tainted host/port could otherwise inject additional
    // request headers into the proxy connection (HTTP request splitting).
    destinationPort = Number(destinationPort) || 0;
    if (!destinationPort || /[\r\n]/.test(destinationHost)) {
        const err = new Error('Invalid proxy destination');
        err.code = errors.EPROXY;
        setImmediate(() => callback(err));
        return;
    }
    const proxy = urllib.parse(proxyUrl);
    const connectOptions = {
        host: proxy.hostname,
        port: Number(proxy.port) ? Number(proxy.port) : proxy.protocol === 'https:' ? 443 : 80
    };
    let connect;
    if (proxy.protocol === 'https:') {
        // Validate the proxy's TLS certificate by default. A caller that uses a
        // self-signed proxy (e.g. integration tests) opts out explicitly with
        // tls.rejectUnauthorized === false.
        connectOptions.rejectUnauthorized = tlsOptions.rejectUnauthorized !== false;
        connect = node_tls_1.default.connect.bind(node_tls_1.default);
    }
    else {
        connect = node_net_1.default.connect.bind(node_net_1.default);
    }
    let socket;
    // Error harness for initial connection. Once connection is established, the responsibility
    // to handle errors is passed to whoever uses this socket
    let finished = false;
    const tempSocketErr = (err) => {
        if (finished) {
            return;
        }
        finished = true;
        try {
            socket.destroy();
        }
        catch (_E) {
            // ignore
        }
        callback(err);
    };
    const timeoutErr = () => {
        const err = new Error('Proxy socket timed out');
        err.code = 'ETIMEDOUT';
        tempSocketErr(err);
    };
    socket = connect(connectOptions, () => {
        if (finished) {
            return;
        }
        const reqHeaders = {
            Host: destinationHost + ':' + destinationPort,
            Connection: 'close'
        };
        if (proxy.auth) {
            reqHeaders['Proxy-Authorization'] = 'Basic ' + Buffer.from(proxy.auth).toString('base64');
        }
        socket.write(
        // HTTP method
        'CONNECT ' +
            destinationHost +
            ':' +
            destinationPort +
            ' HTTP/1.1\r\n' +
            // HTTP request headers
            Object.keys(reqHeaders)
                .map(key => key + ': ' + reqHeaders[key])
                .join('\r\n') +
            // End request
            '\r\n\r\n');
        let headers = '';
        const onSocketData = (chunk) => {
            let match;
            let remainder;
            if (finished) {
                return;
            }
            headers += chunk.toString('binary');
            if ((match = headers.match(/\r\n\r\n/))) {
                socket.removeListener('data', onSocketData);
                remainder = headers.substr(match.index + match[0].length);
                headers = headers.substr(0, match.index);
                if (remainder) {
                    socket.unshift(Buffer.from(remainder, 'binary'));
                }
                // proxy connection is now established
                finished = true;
                // check response code
                match = headers.match(/^HTTP\/\d+\.\d+ (\d+)/i);
                if (!match || (match[1] || '').charAt(0) !== '2') {
                    try {
                        socket.destroy();
                    }
                    catch (_E) {
                        // ignore
                    }
                    const err = new Error('Invalid response from proxy' + ((match && ': ' + match[1]) || ''));
                    err.code = errors.EPROXY;
                    return callback(err);
                }
                socket.removeListener('error', tempSocketErr);
                socket.removeListener('timeout', timeoutErr);
                socket.setTimeout(0);
                return callback(null, socket);
            }
            if (headers.length > MAX_RESPONSE_HEADER_BYTES) {
                socket.removeListener('data', onSocketData);
                const err = new Error('Proxy response headers too large');
                err.code = errors.EPROXY;
                return tempSocketErr(err);
            }
        };
        socket.on('data', onSocketData);
    });
    socket.setTimeout(httpProxyClient.timeout || 30 * 1000);
    socket.on('timeout', timeoutErr);
    socket.once('error', tempSocketErr);
}
exports["default"] = httpProxyClient;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 6619:
/***/ (function(module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const packageData = __importStar(__nccwpck_require__(5552));
const node_events_1 = __nccwpck_require__(8474);
const node_net_1 = __importDefault(__nccwpck_require__(7030));
const node_tls_1 = __importDefault(__nccwpck_require__(1692));
const node_os_1 = __importDefault(__nccwpck_require__(8161));
const node_crypto_1 = __importDefault(__nccwpck_require__(7598));
const data_stream_js_1 = __importDefault(__nccwpck_require__(7004));
const node_stream_1 = __nccwpck_require__(7075);
const shared = __importStar(__nccwpck_require__(9893));
// default timeout values in ms
const CONNECTION_TIMEOUT = 2 * 60 * 1000; // how much to wait for the connection to be established
const SOCKET_TIMEOUT = 10 * 60 * 1000; // how much to wait for socket inactivity before disconnecting the client
const GREETING_TIMEOUT = 30 * 1000; // how much to wait after connection is established but SMTP greeting is not receieved
const DNS_TIMEOUT = 30 * 1000; // how much to wait for resolveHostname
const TEARDOWN_NOOP = () => { }; // reusable no-op handler for absorbing errors during socket teardown
/**
 * Re-interpret a server response stored in fake 8-bit byte-container form
 * (the result of chunk.toString('binary') in _onData) as UTF-8.
 *
 * Server reply text has no formally defined charset (RFC 5321 §4.2.1), but
 * modern MTAs commonly use UTF-8. The byte-container plumbing in _onData is
 * required to reassemble multi-byte sequences split across socket chunks;
 * this helper performs the actual decode at the line boundary, falling back
 * to the byte-container form when the bytes are not valid UTF-8 so that
 * legacy 8-bit replies are still recoverable byte-for-byte.
 */
function decodeServerResponse(str) {
    if (!str) {
        return str;
    }
    const utf8 = Buffer.from(str, 'binary').toString('utf8');
    // The input is a byte container (each char is in U+0000..U+00FF) so it can never
    // already contain U+FFFD; any \uFFFD in the result was inserted by Node's UTF-8
    // decoder for invalid bytes, which means we should return the original bytes intact.
    return utf8.includes('\uFFFD') ? str : utf8;
}
/**
 * True when the last line of a queued reply is a continuation ("250-..."), which means
 * the rest of the reply is still on its way.
 *
 * Called with the byte-container form the queue holds (see _onData): the check only looks
 * at leading ASCII digits and '-' of the last line, and a UTF-8 continuation byte is never
 * 0x0A, so line boundaries and the tested prefix are the same before and after decoding.
 * The last line is read with lastIndexOf rather than split() because a queue entry grows
 * with every chunk appended to it and only its final line matters.
 */
function isPartialResponse(str) {
    return /^\d+-/.test(str.slice(str.lastIndexOf('\n') + 1));
}
/**
 * Generates a SMTP connection object
 *
 * Optional options object takes the following possible properties:
 *
 *  * **port** - is the port to connect to (defaults to 587 or 465)
 *  * **host** - is the hostname or IP address to connect to (defaults to 'localhost')
 *  * **secure** - use SSL
 *  * **ignoreTLS** - ignore server support for STARTTLS
 *  * **requireTLS** - forces the client to use STARTTLS
 *  * **name** - the name of the client server
 *  * **localAddress** - outbound address to bind to (see: http://nodejs.org/api/net.html#net_net_connect_options_connectionlistener)
 *  * **greetingTimeout** - Time to wait in ms until greeting message is received from the server (defaults to 30 seconds)
 *  * **connectionTimeout** - how many milliseconds to wait for the connection to establish (defaults to 2 minutes)
 *  * **socketTimeout** - Time of inactivity until the connection is closed (defaults to 10 minutes)
 *  * **dnsTimeout** - Time to wait in ms for the DNS requests to be resolved (defaults to 30 seconds)
 *  * **lmtp** - if true, uses LMTP instead of SMTP protocol
 *  * **logger** - bunyan compatible logger interface
 *  * **debug** - if true pass SMTP traffic to the logger
 *  * **tls** - options for createCredentials
 *  * **socket** - existing socket to use instead of creating a new one (see: http://nodejs.org/api/net.html#net_class_net_socket)
 *  * **secured** - boolean indicates that the provided socket has already been upgraded to tls
 *
 * @constructor
 * @namespace SMTP Client module
 * @param [options] Option properties
 */
class SMTPConnection extends node_events_1.EventEmitter {
    constructor(options) {
        super(options);
        this.id = node_crypto_1.default.randomBytes(8).toString('base64').replace(/\W/g, '');
        this.stage = 'init';
        this.options = options || {};
        this.secureConnection = !!this.options.secure;
        this.alreadySecured = !!this.options.secured;
        this.port = Number(this.options.port) || (this.secureConnection ? 465 : 587);
        this.host = this.options.host || 'localhost';
        this.servername = this.options.servername ? this.options.servername : !node_net_1.default.isIP(this.host) ? this.host : false;
        this.allowInternalNetworkInterfaces = this.options.allowInternalNetworkInterfaces || false;
        if (typeof this.options.secure === 'undefined' && this.port === 465) {
            // if secure option is not set but port is 465, then default to secure
            this.secureConnection = true;
        }
        this.name = (this.options.name || this._getHostname()).toString().replace(/[\r\n]+/g, '');
        this.logger = shared.getLogger(this.options, {
            component: this.options.component || 'smtp-connection',
            sid: this.id
        });
        this.customAuth = new Map();
        for (const key of Object.keys(this.options.customAuth || {})) {
            const mapKey = (key || '').toString().trim().toUpperCase();
            if (mapKey) {
                this.customAuth.set(mapKey, this.options.customAuth[key]);
            }
        }
        this.version = packageData.version;
        this.authenticated = false;
        this.destroyed = false;
        this.secure = !!this.secureConnection;
        this._remainder = '';
        this._responseQueue = [];
        this.lastServerResponse = false;
        this._socket = false;
        this._supportedAuth = [];
        this.allowsAuth = false;
        this._envelope = false;
        this._supportedExtensions = [];
        this._maxAllowedSize = 0;
        this._responseActions = [];
        this._recipientQueue = [];
        this._greetingTimeout = false;
        this._connectionTimeout = false;
        this._destroyed = false;
        this._closing = false;
        this._currentDataStream = false;
        this._onSocketData = chunk => this._onData(chunk);
        this._onSocketError = error => this._onError(error, 'ESOCKET', false, 'CONN');
        this._onSocketClose = () => this._onClose();
        this._onSocketEnd = () => this._onEnd();
        this._onSocketTimeout = () => this._onTimeout();
        this._onConnectionSocketError = err => this._onConnectionError(err, 'ESOCKET');
        this._connectionAttemptId = 0;
    }
    /**
     * Creates a connection to a SMTP server and sets up connection
     * listener
     */
    connect(connectCallback) {
        if (typeof connectCallback === 'function') {
            this.once('connect', () => {
                this.logger.debug({
                    tnx: 'smtp'
                }, 'SMTP handshake finished');
                connectCallback();
            });
            const isDestroyedMessage = this._isDestroyedMessage('connect');
            if (isDestroyedMessage) {
                return connectCallback(this._formatError(isDestroyedMessage, 'ECONNECTION', false, 'CONN'));
            }
        }
        let opts = {
            port: this.port,
            host: this.host,
            allowInternalNetworkInterfaces: this.allowInternalNetworkInterfaces,
            timeout: this.options.dnsTimeout || DNS_TIMEOUT
        };
        if (this.options.localAddress) {
            opts.localAddress = this.options.localAddress;
        }
        if (this.options.connection) {
            // connection is already opened
            this._socket = this.options.connection;
            this._setupConnectionHandlers();
            if (this.secureConnection && !this.alreadySecured) {
                setImmediate(() => this._upgradeConnection(err => {
                    if (err) {
                        this._onError(new Error('Error initiating TLS - ' + (err.message || err)), 'ETLS', false, 'CONN');
                        return;
                    }
                    this._onConnect();
                }));
            }
            else {
                setImmediate(() => this._onConnect());
            }
            return;
        }
        else if (this.options.socket) {
            // socket object is set up but not yet connected
            this._socket = this.options.socket;
            return this._resolveAndConnect(opts, _resolved => {
                try {
                    this._socket.connect(this.port, this.host, () => {
                        this._socket.setKeepAlive(true);
                        // a `secure` connection over a caller-provided socket must still
                        // perform the TLS handshake, otherwise AUTH and the message body
                        // would be sent in cleartext despite the caller requesting TLS
                        if (this.secureConnection && !this.alreadySecured) {
                            return this._upgradeConnection(err => {
                                if (err) {
                                    this._onError(new Error('Error initiating TLS - ' + (err.message || err)), 'ETLS', false, 'CONN');
                                    return;
                                }
                                this._onConnect();
                            });
                        }
                        this._onConnect();
                    });
                    this._setupConnectionHandlers();
                }
                catch (E) {
                    setImmediate(() => this._onError(E, 'ECONNECTION', false, 'CONN'));
                    return;
                }
            });
        }
        else {
            if (this.secureConnection) {
                Object.assign(opts, this.options.tls || {});
                // ensure servername for SNI
                if (this.servername && !opts.servername) {
                    opts.servername = this.servername;
                }
            }
            return this._resolveAndConnect(opts, resolved => {
                // Store fallback addresses for retry on connection failure
                this._fallbackAddresses = (resolved._addresses || []).filter(addr => addr !== opts.host);
                this._connectOpts = Object.assign({}, opts);
                this._connectToHost(opts, this.secureConnection);
            });
        }
    }
    /**
     * Resolves the hostname and applies resolved values to opts,
     * then calls the provided callback with the resolved data
     *
     * @param opts Connection options (modified in place)
     * @param callback Called with resolved data on success
     */
    _resolveAndConnect(opts, callback) {
        return shared.resolveHostname(opts, (err, resolved) => {
            if (err) {
                return setImmediate(() => this._onError(err, 'EDNS', false, 'CONN'));
            }
            this.logger.debug({
                tnx: 'dns',
                source: opts.host,
                resolved: resolved.host,
                cached: !!resolved.cached
            }, 'Resolved %s as %s [cache %s]', opts.host, resolved.host, resolved.cached ? 'hit' : 'miss');
            for (const key of Object.keys(resolved)) {
                if (key.charAt(0) !== '_' && resolved[key]) {
                    opts[key] = resolved[key];
                }
            }
            callback(resolved);
        });
    }
    /**
     * Attempts to connect to the specified host address
     *
     * @param opts Connection options
     * @param secure Whether to use TLS
     */
    _connectToHost(opts, secure) {
        // If the client was closed while DNS resolution was in flight, do not open
        // a socket here: close() ran with this._socket still unset and so had
        // nothing to tear down, and _onConnect's remedial close() is a no-op once
        // _closing is set, the freshly connected socket would leak.
        if (this._destroyed || this._closing) {
            return;
        }
        this._connectionAttemptId++;
        const currentAttemptId = this._connectionAttemptId;
        const connectFn = secure
            ? node_tls_1.default.connect
            : node_net_1.default.connect;
        try {
            this._socket = connectFn(opts, () => {
                // Ignore callback if this is a stale connection attempt
                if (this._connectionAttemptId !== currentAttemptId) {
                    return;
                }
                this._socket.setKeepAlive(true);
                this._onConnect();
            });
            this._setupConnectionHandlers();
        }
        catch (E) {
            setImmediate(() => this._onError(E, 'ECONNECTION', false, 'CONN'));
            return;
        }
    }
    /**
     * Sets up connection timeout and error handlers
     */
    _setupConnectionHandlers() {
        this._connectionTimeout = setTimeout(() => {
            this._onConnectionError('Connection timeout', 'ETIMEDOUT');
        }, this.options.connectionTimeout || CONNECTION_TIMEOUT);
        this._socket.on('error', this._onConnectionSocketError);
    }
    /**
     * Handles connection errors with fallback to alternative addresses
     *
     * @param err Error object or message
     * @param code Error code
     */
    _onConnectionError(err, code) {
        clearTimeout(this._connectionTimeout);
        // Check if we have fallback addresses to try
        const canFallback = this._fallbackAddresses && this._fallbackAddresses.length && this.stage === 'init' && !this._destroyed;
        if (!canFallback) {
            // No more fallback addresses, report the error
            this._onError(err, code, false, 'CONN');
            return;
        }
        const nextHost = this._fallbackAddresses.shift();
        this.logger.info({
            tnx: 'network',
            failedHost: this._connectOpts.host,
            nextHost,
            error: err.message || err
        }, 'Connection to %s failed, trying %s', this._connectOpts.host, nextHost);
        // Clean up current socket
        if (this._socket) {
            try {
                this._socket.removeListener('error', this._onConnectionSocketError);
                // Absorb any late teardown error (e.g. a TLS fallback socket emitting
                // after destroy), mirroring the guard used in close()
                this._socket.on('error', TEARDOWN_NOOP);
                this._socket.destroy();
            }
            catch (_E) {
                // ignore
            }
            this._socket = null;
        }
        // Update host and retry
        this._connectOpts.host = nextHost;
        this._connectToHost(this._connectOpts, this.secureConnection);
    }
    /**
     * Sends QUIT
     */
    quit() {
        this._sendCommand('QUIT');
        this._responseActions.push(this.close);
    }
    /**
     * Closes the connection to the server
     */
    close() {
        clearTimeout(this._connectionTimeout);
        clearTimeout(this._greetingTimeout);
        this._responseActions = [];
        // allow to run this function only once
        if (this._closing) {
            return;
        }
        this._closing = true;
        const closeMethod = this.stage === 'init' ? 'destroy' : 'end';
        this.logger.debug({
            tnx: 'smtp'
        }, 'Closing connection to the server using "%s"', closeMethod);
        const socket = (this._socket && this._socket.socket) || this._socket;
        // Detach any in-flight DATA stream from the socket so the source stream
        // can be garbage-collected once the socket is gone.
        if (this._currentDataStream) {
            try {
                this._currentDataStream.unpipe(this._socket);
            }
            catch (_E) {
                // ignore
            }
            this._currentDataStream = false;
        }
        if (socket && !socket.destroyed) {
            try {
                // Clear socket timeout to prevent timer leaks
                socket.setTimeout(0);
                // Remove all listeners to allow proper garbage collection
                socket.removeListener('data', this._onSocketData);
                socket.removeListener('timeout', this._onSocketTimeout);
                socket.removeListener('close', this._onSocketClose);
                socket.removeListener('end', this._onSocketEnd);
                socket.removeListener('error', this._onSocketError);
                socket.removeListener('error', this._onConnectionSocketError);
                // Absorb errors that may fire during socket teardown (e.g. server
                // sending cleartext after TLS shutdown triggers ERR_SSL_BAD_RECORD_TYPE)
                socket.on('error', TEARDOWN_NOOP);
                socket[closeMethod]();
            }
            catch (_E) {
                // just ignore
            }
        }
        this._destroy();
    }
    /**
     * Authenticate user
     */
    login(authData, callback) {
        const isDestroyedMessage = this._isDestroyedMessage('login');
        if (isDestroyedMessage) {
            return callback(this._formatError(isDestroyedMessage, 'ECONNECTION', false, 'API'));
        }
        this._auth = authData || {};
        // Select SASL authentication method
        this._authMethod = (this._auth.method || '').toString().trim().toUpperCase() || false;
        if (!this._authMethod && this._auth.oauth2 && !this._auth.credentials) {
            this._authMethod = 'XOAUTH2';
        }
        else if (!this._authMethod || (this._authMethod === 'XOAUTH2' && !this._auth.oauth2)) {
            // use first supported
            this._authMethod = (this._supportedAuth[0] || 'PLAIN').toUpperCase().trim();
        }
        if (this._authMethod !== 'XOAUTH2' && (!this._auth.credentials || !this._auth.credentials.user || !this._auth.credentials.pass)) {
            if ((this._auth.user && this._auth.pass) || this.customAuth.has(this._authMethod)) {
                this._auth.credentials = {
                    user: this._auth.user,
                    pass: this._auth.pass,
                    options: this._auth.options
                };
            }
            else {
                return callback(this._formatError('Missing credentials for "' + this._authMethod + '"', 'EAUTH', false, 'API'));
            }
        }
        if (this.customAuth.has(this._authMethod)) {
            const handler = this.customAuth.get(this._authMethod);
            let lastResponse;
            let returned = false;
            const resolve = () => {
                if (returned) {
                    return;
                }
                returned = true;
                this.logger.info({
                    tnx: 'smtp',
                    username: this._auth.user,
                    action: 'authenticated',
                    method: this._authMethod
                }, 'User %s authenticated', JSON.stringify(this._auth.user));
                this.authenticated = true;
                callback(null, true);
            };
            const reject = (err) => {
                if (returned) {
                    return;
                }
                returned = true;
                callback(this._formatError(err, 'EAUTH', lastResponse, 'AUTH ' + this._authMethod));
            };
            const handlerResponse = handler({
                auth: this._auth,
                method: this._authMethod,
                extensions: [].concat(this._supportedExtensions),
                authMethods: [].concat(this._supportedAuth),
                maxAllowedSize: this._maxAllowedSize || false,
                sendCommand: (cmd, done) => {
                    let promise;
                    if (!done) {
                        promise = new Promise((resolve, reject) => {
                            done = shared.callbackPromise(resolve, reject);
                        });
                    }
                    this._responseActions.push(str => {
                        lastResponse = str;
                        let codes = str.match(/^(\d+)(?:\s(\d+\.\d+\.\d+))?\s/);
                        let data = {
                            command: cmd,
                            response: str
                        };
                        if (codes) {
                            data.status = Number(codes[1]) || 0;
                            if (codes[2]) {
                                data.code = codes[2];
                            }
                            data.text = str.substr(codes[0].length);
                        }
                        else {
                            data.text = str;
                            data.status = 0; // just in case we need to perform numeric comparisons
                        }
                        done(null, data);
                    });
                    setImmediate(() => this._sendCommand(cmd));
                    return promise;
                },
                resolve,
                reject
            });
            if (handlerResponse && typeof handlerResponse.catch === 'function') {
                // a promise was returned
                handlerResponse.then(resolve).catch(reject);
            }
            return;
        }
        switch (this._authMethod) {
            case 'XOAUTH2':
                this._handleXOauth2Token(false, callback);
                return;
            case 'LOGIN':
                this._responseActions.push(str => {
                    this._actionAUTH_LOGIN_USER(str, callback);
                });
                this._sendCommand('AUTH LOGIN');
                return;
            case 'PLAIN':
                this._responseActions.push(str => {
                    this._actionAUTHComplete(str, callback);
                });
                this._sendCommand('AUTH PLAIN ' +
                    Buffer.from(
                    //this._auth.user+'\u0000'+
                    '\u0000' + // skip authorization identity as it causes problems with some servers
                        this._auth.credentials.user +
                        '\u0000' +
                        this._auth.credentials.pass, 'utf-8').toString('base64'), 
                // log entry without passwords
                'AUTH PLAIN ' +
                    Buffer.from(
                    //this._auth.user+'\u0000'+
                    '\u0000' + // skip authorization identity as it causes problems with some servers
                        this._auth.credentials.user +
                        '\u0000' +
                        '/* secret */', 'utf-8').toString('base64'));
                return;
            case 'CRAM-MD5':
                this._responseActions.push(str => {
                    this._actionAUTH_CRAM_MD5(str, callback);
                });
                this._sendCommand('AUTH CRAM-MD5');
                return;
        }
        return callback(this._formatError('Unknown authentication method "' + this._authMethod + '"', 'EAUTH', false, 'API'));
    }
    /**
     * Sends a message
     *
     * @param envelope Envelope object, {from: addr, to: [addr]}
     * @param message String, Buffer or a Stream
     * @param callback Callback to return once sending is completed
     */
    send(envelope, message, done) {
        if (!message) {
            return done(this._formatError('Empty message', 'EMESSAGE', false, 'API'));
        }
        const isDestroyedMessage = this._isDestroyedMessage('send message');
        if (isDestroyedMessage) {
            return done(this._formatError(isDestroyedMessage, 'ECONNECTION', false, 'API'));
        }
        // reject larger messages than allowed
        if (this._maxAllowedSize && envelope.size > this._maxAllowedSize) {
            setImmediate(() => {
                done(this._formatError('Message size larger than allowed ' + this._maxAllowedSize, 'EMESSAGE', false, 'MAIL FROM'));
            });
            return;
        }
        // ensure that callback is only called once
        let returned = false;
        const callback = function (...args) {
            if (returned) {
                return;
            }
            returned = true;
            done(...args);
        };
        if (typeof message.on === 'function') {
            message.on('error', err => callback(this._formatError(err, 'ESTREAM', false, 'API')));
        }
        const startTime = Date.now();
        this._setEnvelope(envelope, (err, info) => {
            if (err) {
                // create passthrough stream to consume to prevent OOM
                const stream = new node_stream_1.PassThrough();
                if (typeof message.pipe === 'function') {
                    message.pipe(stream);
                }
                else {
                    stream.write(message);
                    stream.end();
                }
                return callback(err);
            }
            const envelopeTime = Date.now();
            const stream = this._createSendStream((err, str) => {
                if (err) {
                    return callback(err);
                }
                info.envelopeTime = envelopeTime - startTime;
                info.messageTime = Date.now() - envelopeTime;
                info.messageSize = stream.outByteCount;
                info.response = str;
                return callback(null, info);
            });
            if (typeof message.pipe === 'function') {
                message.pipe(stream);
            }
            else {
                stream.write(message);
                stream.end();
            }
        });
    }
    /**
     * Resets connection state
     *
     * @param callback Callback to return once connection is reset
     */
    reset(callback) {
        const isDestroyedMessage = this._isDestroyedMessage('reset');
        if (isDestroyedMessage) {
            return callback(this._formatError(isDestroyedMessage, 'ECONNECTION', false, 'API'));
        }
        this._sendCommand('RSET');
        this._responseActions.push(str => {
            if (str.charAt(0) !== '2') {
                return callback(this._formatError('Could not reset session state. response=' + str, 'EPROTOCOL', str, 'RSET'));
            }
            this._envelope = false;
            return callback(null, true);
        });
    }
    /**
     * Connection listener that is run when the connection to
     * the server is opened
     *
     * @event
     */
    _onConnect() {
        const socket = this._socket;
        clearTimeout(this._connectionTimeout);
        this.logger.info({
            tnx: 'network',
            localAddress: socket.localAddress,
            localPort: socket.localPort,
            remoteAddress: socket.remoteAddress,
            remotePort: socket.remotePort
        }, '%s established to %s:%s', this.secure ? 'Secure connection' : 'Connection', socket.remoteAddress, socket.remotePort);
        if (this._destroyed) {
            // Connection was established after we already had canceled it
            this.close();
            return;
        }
        this.stage = 'connected';
        // clear existing listeners for the socket
        socket.removeListener('data', this._onSocketData);
        socket.removeListener('timeout', this._onSocketTimeout);
        socket.removeListener('close', this._onSocketClose);
        socket.removeListener('end', this._onSocketEnd);
        // Switch from connection-phase error handler to normal error handler
        socket.removeListener('error', this._onConnectionSocketError);
        // _upgradeConnection (options.connection + secure) may already have attached
        // the normal handler; remove it first so we never end up with a duplicate
        socket.removeListener('error', this._onSocketError);
        socket.on('error', this._onSocketError);
        socket.on('data', this._onSocketData);
        socket.once('close', this._onSocketClose);
        socket.once('end', this._onSocketEnd);
        socket.setTimeout(this.options.socketTimeout || SOCKET_TIMEOUT);
        socket.on('timeout', this._onSocketTimeout);
        this._greetingTimeout = setTimeout(() => {
            // if still waiting for greeting, give up
            if (this._socket && !this._destroyed && this._responseActions[0] === this._actionGreeting) {
                this._onError('Greeting never received', 'ETIMEDOUT', false, 'CONN');
            }
        }, this.options.greetingTimeout || GREETING_TIMEOUT);
        this._responseActions.push(this._actionGreeting);
        // we have a 'data' listener set up so resume socket if it was paused
        socket.resume();
    }
    /**
     * 'data' listener for data coming from the server
     *
     * @event
     * @param chunk Data chunk coming from the server
     */
    _onData(chunk) {
        if (this._destroyed || !chunk || !chunk.length) {
            return;
        }
        let data = chunk.toString('binary');
        let lines = (this._remainder + data).split(/\r?\n/);
        let lastline;
        this._remainder = lines.pop();
        for (let i = 0, len = lines.length; i < len; i++) {
            if (this._responseQueue.length) {
                lastline = this._responseQueue[this._responseQueue.length - 1];
                if (isPartialResponse(lastline)) {
                    this._responseQueue[this._responseQueue.length - 1] += '\n' + lines[i];
                    continue;
                }
            }
            this._responseQueue.push(lines[i]);
        }
        if (this._responseQueue.length) {
            lastline = this._responseQueue[this._responseQueue.length - 1];
            if (isPartialResponse(lastline)) {
                return;
            }
        }
        this._processResponse();
    }
    /**
     * 'error' listener for the socket
     *
     * @event
     * @param err Error object
     * @param type Error name
     */
    _onError(err, type, data, command) {
        clearTimeout(this._connectionTimeout);
        clearTimeout(this._greetingTimeout);
        if (this._destroyed) {
            // just ignore, already closed
            // this might happen when a socket is canceled because of reached timeout
            // but the socket timeout error itself receives only after
            return;
        }
        err = this._formatError(err, type, data, command);
        const transientCodes = ['ETIMEDOUT', 'ESOCKET', 'ECONNECTION'];
        if (transientCodes.includes(err.code)) {
            this.logger.warn(data, err.message);
        }
        else {
            this.logger.error(data, err.message);
        }
        this.emit('error', err);
        this.close();
    }
    _formatError(message, type, response, command) {
        let err;
        if (/Error\]$/i.test(Object.prototype.toString.call(message))) {
            err = message;
        }
        else {
            err = new Error(message);
        }
        if (type && type !== 'Error') {
            err.code = type;
        }
        if (response) {
            err.response = response;
            err.message += ': ' + response;
        }
        const responseCode = (typeof response === 'string' && Number((response.match(/^\d+/) || [])[0])) || false;
        if (responseCode) {
            err.responseCode = responseCode;
        }
        if (command) {
            err.command = command;
        }
        return err;
    }
    /**
     * 'close' listener for the socket
     *
     * @event
     */
    _onClose() {
        let serverResponse = false;
        if (this._remainder && this._remainder.trim()) {
            this.lastServerResponse = serverResponse = decodeServerResponse(this._remainder.trim());
            if (this.options.debug || this.options.transactionLog) {
                this.logger.debug({
                    tnx: 'server'
                }, serverResponse);
            }
        }
        this.logger.info({
            tnx: 'network'
        }, 'Connection closed');
        if (this.upgrading && !this._destroyed) {
            return this._onError(new Error('Connection closed unexpectedly'), 'ETLS', serverResponse, 'CONN');
        }
        else if (![this._actionGreeting, this.close].includes(this._responseActions[0]) && !this._destroyed) {
            return this._onError(new Error('Connection closed unexpectedly'), 'ECONNECTION', serverResponse, 'CONN');
        }
        else if (/^[45]\d{2}\b/.test(serverResponse)) {
            return this._onError(new Error('Connection closed unexpectedly'), 'ECONNECTION', serverResponse, 'CONN');
        }
        this._destroy();
    }
    /**
     * 'end' listener for the socket
     *
     * @event
     */
    _onEnd() {
        if (this._socket && !this._socket.destroyed) {
            // Peer sent FIN, finish our half of the close gracefully rather
            // than destroying. 'close' fires after the OS finalizes teardown.
            this._socket.end();
        }
    }
    /**
     * 'timeout' listener for the socket
     *
     * @event
     */
    _onTimeout() {
        return this._onError(new Error('Timeout'), 'ETIMEDOUT', false, 'CONN');
    }
    /**
     * Destroys the client, emits 'end'
     */
    _destroy() {
        if (this._destroyed) {
            return;
        }
        this._destroyed = true;
        // keep the documented public flag in sync with the private state
        this.destroyed = true;
        // a connection the server dropped before the greeting would otherwise keep
        // the greeting timer, and with it the process, alive until it fires
        clearTimeout(this._connectionTimeout);
        clearTimeout(this._greetingTimeout);
        this._connectionTimeout = false;
        this._greetingTimeout = false;
        this.emit('end');
    }
    /**
     * Upgrades the connection to TLS
     *
     * @param callback Callback function to run when the connection
     *        has been secured
     */
    _upgradeConnection(callback) {
        // RFC 3207 section 6: the client MUST discard any knowledge obtained from
        // the server that was not received over the TLS-protected session. Drop any
        // buffered input received before the handshake so a man-in-the-middle cannot
        // inject plaintext bytes after the "220" reply (e.g. a CRLF-free fragment that
        // would otherwise be prepended to the first post-TLS response and parsed as
        // part of the secured EHLO capabilities). STARTTLS response injection.
        this._remainder = '';
        this._responseQueue = [];
        // do not remove all listeners or it breaks node v0.10 as there's
        // apparently a 'finish' event set that would be cleared as well
        // we can safely keep 'error', 'end', 'close' etc. events
        const socketPlain = this._socket;
        socketPlain.removeListener('data', this._onSocketData); // incoming data is going to be gibberish from this point onwards
        socketPlain.removeListener('timeout', this._onSocketTimeout); // timeout will be re-set for the new socket object
        const opts = Object.assign({
            socket: socketPlain,
            host: this.host
        }, this.options.tls || {});
        // ensure servername for SNI
        if (this.servername && !opts.servername) {
            opts.servername = this.servername;
        }
        // Remove all listeners from the plain socket to allow proper garbage
        // collection. Used on both the TLS-success path and the synchronous
        // tls.connect() throw path; either way the plain socket is done.
        const removePlainSocketListeners = () => {
            socketPlain.removeListener('close', this._onSocketClose);
            socketPlain.removeListener('end', this._onSocketEnd);
            socketPlain.removeListener('error', this._onSocketError);
            // the connection-phase handler is attached when upgrading a pre-opened
            // options.connection socket; strip it so nothing lingers on the plain socket
            socketPlain.removeListener('error', this._onConnectionSocketError);
        };
        this.upgrading = true;
        // tls.connect is not an asynchronous function however it may still throw errors and requires to be wrapped with try/catch
        try {
            this._socket = node_tls_1.default.connect(opts, () => {
                this.secure = true;
                this.upgrading = false;
                this._socket.on('data', this._onSocketData);
                removePlainSocketListeners();
                return callback(null, true);
            });
        }
        catch (err) {
            removePlainSocketListeners();
            return callback(err);
        }
        this._socket.on('error', this._onSocketError);
        this._socket.once('close', this._onSocketClose);
        this._socket.once('end', this._onSocketEnd);
        this._socket.setTimeout(this.options.socketTimeout || SOCKET_TIMEOUT); // 10 min.
        this._socket.on('timeout', this._onSocketTimeout);
        // resume in case the socket was paused
        socketPlain.resume();
    }
    /**
     * Processes queued responses from the server
     */
    _processResponse() {
        if (!this._responseQueue.length) {
            return false;
        }
        const raw = (this._responseQueue.shift() || '').toString();
        // Skip unexpected empty lines without consuming a response action or
        // overwriting lastServerResponse; reprocess whatever else is queued.
        if (!raw.trim()) {
            setImmediate(() => this._processResponse());
            return;
        }
        if (isPartialResponse(raw)) {
            // the rest of the reply is still on its way: put it back on the queue and wait
            // rather than dropping it. It has not been received in full, so it must not be
            // reported as the last server response either
            this._responseQueue.unshift(raw);
            return;
        }
        const str = (this.lastServerResponse = decodeServerResponse(raw));
        if (this.options.debug || this.options.transactionLog) {
            this.logger.debug({
                tnx: 'server'
            }, str.replace(/\r?\n$/, ''));
        }
        const action = this._responseActions.shift();
        if (typeof action === 'function') {
            action.call(this, str);
            setImmediate(() => this._processResponse());
        }
        else {
            return this._onError(new Error('Unexpected Response'), 'EPROTOCOL', str, 'CONN');
        }
    }
    /**
     * Send a command to the server, append \r\n
     *
     * @param str String to be sent to the server
     * @param logStr Optional string to be used for logging instead of the actual string
     */
    _sendCommand(str, logStr) {
        if (this._destroyed) {
            // Connection already closed, can't send any more data
            return;
        }
        const socket = this._socket;
        if (socket.destroyed) {
            return this.close();
        }
        if (this.options.debug || this.options.transactionLog) {
            this.logger.debug({
                tnx: 'client'
            }, (logStr || str || '').toString().replace(/\r?\n$/, ''));
        }
        socket.write(Buffer.from(str + '\r\n', 'utf-8'));
    }
    /**
     * Initiates a new message by submitting envelope data, starting with
     * MAIL FROM: command
     *
     * @param envelope Envelope object in the form of
     *        {from:'...', to:['...']}
     *        or
     *        {from:{address:'...',name:'...'}, to:[address:'...',name:'...']}
     */
    _setEnvelope(envelope, callback) {
        const args = [];
        let useSmtpUtf8 = false;
        this._envelope = (envelope || {});
        this._envelope.from = ((this._envelope.from && this._envelope.from.address) || this._envelope.from || '')
            .toString()
            .trim();
        this._envelope.to = []
            .concat(this._envelope.to || [])
            .map(to => ((to && to.address) || to || '').toString().trim());
        if (!this._envelope.to.length) {
            return callback(this._formatError('No recipients defined', 'EENVELOPE', false, 'API'));
        }
        if (this._envelope.from && /[\r\n<>]/.test(this._envelope.from)) {
            return callback(this._formatError('Invalid sender ' + JSON.stringify(this._envelope.from), 'EENVELOPE', false, 'API'));
        }
        // check if the sender address uses only ASCII characters,
        // otherwise require usage of SMTPUTF8 extension
        if (/[\x80-\uFFFF]/.test(this._envelope.from)) {
            useSmtpUtf8 = true;
        }
        for (let i = 0, len = this._envelope.to.length; i < len; i++) {
            if (!this._envelope.to[i] || /[\r\n<>]/.test(this._envelope.to[i])) {
                return callback(this._formatError('Invalid recipient ' + JSON.stringify(this._envelope.to[i]), 'EENVELOPE', false, 'API'));
            }
            // check if the recipients addresses use only ASCII characters,
            // otherwise require usage of SMTPUTF8 extension
            if (/[\x80-\uFFFF]/.test(this._envelope.to[i])) {
                useSmtpUtf8 = true;
            }
        }
        // clone the recipients array for latter manipulation
        this._envelope.rcptQueue = [].concat(this._envelope.to || []);
        this._envelope.rejected = [];
        this._envelope.rejectedErrors = [];
        this._envelope.accepted = [];
        if (this._envelope.dsn) {
            try {
                this._envelope.dsn = this._setDsnEnvelope(this._envelope.dsn);
            }
            catch (err) {
                return callback(this._formatError('Invalid DSN ' + err.message, 'EENVELOPE', false, 'API'));
            }
        }
        // RFC 8689: validate REQUIRETLS eligibility before queuing the MAIL FROM
        // response action, so a rejection here cannot leave an orphaned action in
        // _responseActions (which would consume the next reply and desync a reused
        // connection).
        if (this._envelope.requireTLSExtensionEnabled) {
            if (!this.secure) {
                return callback(this._formatError('REQUIRETLS can only be used over TLS connections (RFC 8689)', 'EREQUIRETLS', false, 'MAIL FROM'));
            }
            if (!this._supportedExtensions.includes('REQUIRETLS')) {
                return callback(this._formatError('Server does not support REQUIRETLS extension (RFC 8689)', 'EREQUIRETLS', false, 'MAIL FROM'));
            }
        }
        this._responseActions.push(str => {
            this._actionMAIL(str, callback);
        });
        // If the server supports SMTPUTF8 and the envelope includes an internationalized
        // email address then append SMTPUTF8 keyword to the MAIL FROM command
        if (useSmtpUtf8 && this._supportedExtensions.includes('SMTPUTF8')) {
            args.push('SMTPUTF8');
            this._usingSmtpUtf8 = true;
        }
        // If the server supports 8BITMIME and the message might contain non-ascii bytes
        // then append the 8BITMIME keyword to the MAIL FROM command
        if (this._envelope.use8BitMime && this._supportedExtensions.includes('8BITMIME')) {
            args.push('BODY=8BITMIME');
            this._using8BitMime = true;
        }
        if (this._envelope.size && this._supportedExtensions.includes('SIZE')) {
            const sizeValue = Number(this._envelope.size) || 0;
            if (sizeValue > 0) {
                args.push('SIZE=' + sizeValue);
            }
        }
        // If the server supports DSN and the envelope includes an DSN prop
        // then append DSN params to the MAIL FROM command
        if (this._envelope.dsn && this._supportedExtensions.includes('DSN')) {
            if (this._envelope.dsn.ret) {
                args.push('RET=' + shared.encodeXText(this._envelope.dsn.ret));
            }
            if (this._envelope.dsn.envid) {
                args.push('ENVID=' + shared.encodeXText(this._envelope.dsn.envid));
            }
        }
        // RFC 8689: append the REQUIRETLS keyword to MAIL FROM. Eligibility
        // (TLS connection + server support) was already validated above, before
        // the response action was queued.
        if (this._envelope.requireTLSExtensionEnabled) {
            args.push('REQUIRETLS');
        }
        this._sendCommand('MAIL FROM:<' + this._envelope.from + '>' + (args.length ? ' ' + args.join(' ') : ''));
    }
    _setDsnEnvelope(params) {
        let ret = (params.ret || params.return || '').toString().toUpperCase() || null;
        if (ret) {
            switch (ret) {
                case 'HDRS':
                case 'HEADERS':
                    ret = 'HDRS';
                    break;
                case 'FULL':
                case 'BODY':
                    ret = 'FULL';
                    break;
            }
        }
        if (ret && !['FULL', 'HDRS'].includes(ret)) {
            throw new Error('ret: ' + JSON.stringify(ret));
        }
        const envid = (params.envid || params.id || '').toString() || null;
        let notify = params.notify || null;
        if (notify) {
            if (typeof notify === 'string') {
                notify = notify.split(',');
            }
            notify = notify.map(n => n.trim().toUpperCase());
            const validNotify = ['NEVER', 'SUCCESS', 'FAILURE', 'DELAY'];
            const invalidNotify = notify.filter(n => !validNotify.includes(n));
            if (invalidNotify.length || (notify.length > 1 && notify.includes('NEVER'))) {
                throw new Error('notify: ' + JSON.stringify(notify.join(',')));
            }
            notify = notify.join(',');
        }
        let orcpt = (params.recipient || params.orcpt || '').toString() || null;
        if (orcpt && orcpt.indexOf(';') < 0) {
            orcpt = 'rfc822;' + orcpt;
        }
        return {
            ret,
            envid,
            notify,
            orcpt
        };
    }
    _getDsnRcptToArgs() {
        const envelope = this._envelope;
        const args = [];
        // If the server supports DSN and the envelope includes an DSN prop
        // then append DSN params to the RCPT TO command
        if (envelope.dsn && this._supportedExtensions.includes('DSN')) {
            if (envelope.dsn.notify) {
                args.push('NOTIFY=' + shared.encodeXText(envelope.dsn.notify));
            }
            if (envelope.dsn.orcpt) {
                args.push('ORCPT=' + shared.encodeXText(envelope.dsn.orcpt));
            }
        }
        return args.length ? ' ' + args.join(' ') : '';
    }
    _createSendStream(callback) {
        const envelope = this._envelope;
        const dataStream = new data_stream_js_1.default();
        if (this.options.lmtp) {
            envelope.accepted.forEach((recipient, i) => {
                const final = i === envelope.accepted.length - 1;
                this._responseActions.push(str => {
                    this._actionLMTPStream(recipient, final, str, callback);
                });
            });
        }
        else {
            this._responseActions.push(str => {
                this._actionSMTPStream(str, callback);
            });
        }
        this._currentDataStream = dataStream;
        dataStream.pipe(this._socket, {
            end: false
        });
        if (this.options.debug) {
            const logStream = new node_stream_1.PassThrough();
            logStream.on('readable', () => {
                let chunk;
                while ((chunk = logStream.read())) {
                    this.logger.debug({
                        tnx: 'message'
                    }, chunk.toString('binary').replace(/\r?\n$/, ''));
                }
            });
            dataStream.pipe(logStream);
        }
        dataStream.once('end', () => {
            if (this._currentDataStream === dataStream) {
                this._currentDataStream = false;
            }
            this.logger.info({
                tnx: 'message',
                inByteCount: dataStream.inByteCount,
                outByteCount: dataStream.outByteCount
            }, '<%s bytes encoded mime message (source size %s bytes)>', dataStream.outByteCount, dataStream.inByteCount);
        });
        return dataStream;
    }
    /** ACTIONS **/
    /**
     * Will be run after the connection is created and the server sends
     * a greeting. If the incoming message starts with 220 initiate
     * SMTP session by sending EHLO command
     *
     * @param str Message from the server
     */
    _actionGreeting(str) {
        clearTimeout(this._greetingTimeout);
        if (str.substr(0, 3) !== '220') {
            this._onError(new Error('Invalid greeting. response=' + str), 'EPROTOCOL', str, 'CONN');
            return;
        }
        if (this.options.lmtp) {
            this._responseActions.push(this._actionLHLO);
            this._sendCommand('LHLO ' + this.name);
        }
        else {
            this._responseActions.push(this._actionEHLO);
            this._sendCommand('EHLO ' + this.name);
        }
    }
    /**
     * Handles server response for LHLO command. If it yielded in
     * error, emit 'error', otherwise treat this as an EHLO response
     *
     * @param str Message from the server
     */
    _actionLHLO(str) {
        if (str.charAt(0) !== '2') {
            this._onError(new Error('Invalid LHLO. response=' + str), 'EPROTOCOL', str, 'LHLO');
            return;
        }
        this._actionEHLO(str);
    }
    /**
     * Handles server response for EHLO command. If it yielded in
     * error, try HELO instead, otherwise initiate TLS negotiation
     * if STARTTLS is supported by the server or move into the
     * authentication phase.
     *
     * @param str Message from the server
     */
    _actionEHLO(str) {
        let match;
        if (str.substr(0, 3) === '421') {
            this._onError(new Error('Server terminates connection. response=' + str), 'ECONNECTION', str, 'EHLO');
            return;
        }
        if (str.charAt(0) !== '2') {
            if (this.options.requireTLS) {
                this._onError(new Error('EHLO failed but HELO does not support required STARTTLS. response=' + str), 'ECONNECTION', str, 'EHLO');
                return;
            }
            // Try HELO instead
            this._responseActions.push(this._actionHELO);
            this._sendCommand('HELO ' + this.name);
            return;
        }
        this._ehloLines = str
            .split(/\r?\n/)
            .map(line => line.replace(/^\d+[ -]/, '').trim())
            .filter(line => line)
            .slice(1);
        // Detect if the server supports STARTTLS
        if (!this.secure && !this.options.ignoreTLS && (/[ -]STARTTLS\b/im.test(str) || this.options.requireTLS)) {
            this._sendCommand('STARTTLS');
            this._responseActions.push(this._actionSTARTTLS);
            return;
        }
        // Detect if the server supports SMTPUTF8
        if (/[ -]SMTPUTF8\b/im.test(str)) {
            this._supportedExtensions.push('SMTPUTF8');
        }
        // Detect if the server supports DSN
        if (/[ -]DSN\b/im.test(str)) {
            this._supportedExtensions.push('DSN');
        }
        // Detect if the server supports 8BITMIME
        if (/[ -]8BITMIME\b/im.test(str)) {
            this._supportedExtensions.push('8BITMIME');
        }
        // Detect if the server supports REQUIRETLS (RFC 8689)
        if (/[ -]REQUIRETLS\b/im.test(str)) {
            this._supportedExtensions.push('REQUIRETLS');
        }
        // Detect if the server supports PIPELINING
        if (/[ -]PIPELINING\b/im.test(str)) {
            this._supportedExtensions.push('PIPELINING');
        }
        // Detect if the server supports AUTH
        if (/[ -]AUTH\b/i.test(str)) {
            this.allowsAuth = true;
        }
        // Detect if the server supports PLAIN auth
        if (/[ -]AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)PLAIN/i.test(str)) {
            this._supportedAuth.push('PLAIN');
        }
        // Detect if the server supports LOGIN auth
        if (/[ -]AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)LOGIN/i.test(str)) {
            this._supportedAuth.push('LOGIN');
        }
        // Detect if the server supports CRAM-MD5 auth
        if (/[ -]AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)CRAM-MD5/i.test(str)) {
            this._supportedAuth.push('CRAM-MD5');
        }
        // Detect if the server supports XOAUTH2 auth
        if (/[ -]AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)XOAUTH2/i.test(str)) {
            this._supportedAuth.push('XOAUTH2');
        }
        // Detect if the server supports SIZE extensions (and the max allowed size)
        if ((match = str.match(/[ -]SIZE(?:[ \t]+(\d+))?/im))) {
            this._supportedExtensions.push('SIZE');
            this._maxAllowedSize = Number(match[1]) || 0;
        }
        this.emit('connect');
    }
    /**
     * Handles server response for HELO command. If it yielded in
     * error, emit 'error', otherwise move into the authentication phase.
     *
     * @param str Message from the server
     */
    _actionHELO(str) {
        if (str.charAt(0) !== '2') {
            this._onError(new Error('Invalid HELO. response=' + str), 'EPROTOCOL', str, 'HELO');
            return;
        }
        // assume that authentication is enabled (most probably is not though)
        this.allowsAuth = true;
        this.emit('connect');
    }
    /**
     * Handles server response for STARTTLS command. If there's an error
     * try HELO instead, otherwise initiate TLS upgrade. If the upgrade
     * succeedes restart the EHLO
     *
     * @param str Message from the server
     */
    _actionSTARTTLS(str) {
        if (str.charAt(0) !== '2') {
            if (this.options.opportunisticTLS) {
                this.logger.info({
                    tnx: 'smtp'
                }, 'Failed STARTTLS upgrade, continuing unencrypted');
                this.emit('connect');
                return;
            }
            this._onError(new Error('Error upgrading connection with STARTTLS'), 'ETLS', str, 'STARTTLS');
            return;
        }
        this._upgradeConnection((err, secured) => {
            if (err) {
                this._onError(new Error('Error initiating TLS - ' + (err.message || err)), 'ETLS', false, 'STARTTLS');
                return;
            }
            this.logger.info({
                tnx: 'smtp'
            }, 'Connection upgraded with STARTTLS');
            if (secured) {
                // restart session
                if (this.options.lmtp) {
                    this._responseActions.push(this._actionLHLO);
                    this._sendCommand('LHLO ' + this.name);
                }
                else {
                    this._responseActions.push(this._actionEHLO);
                    this._sendCommand('EHLO ' + this.name);
                }
            }
            else {
                this.emit('connect');
            }
        });
    }
    /**
     * Handle the response for AUTH LOGIN command. We are expecting
     * '334 VXNlcm5hbWU6' (base64 for 'Username:'). Data to be sent as
     * response needs to be base64 encoded username. We do not need
     * exact match but settle with 334 response in general as some
     * hosts invalidly use a longer message than VXNlcm5hbWU6
     *
     * @param str Message from the server
     */
    _actionAUTH_LOGIN_USER(str, callback) {
        if (!/^334[ -]/.test(str)) {
            // expecting '334 VXNlcm5hbWU6'
            callback(this._formatError('Invalid login sequence while waiting for "334 VXNlcm5hbWU6"', 'EAUTH', str, 'AUTH LOGIN'));
            return;
        }
        this._responseActions.push(str => {
            this._actionAUTH_LOGIN_PASS(str, callback);
        });
        this._sendCommand(Buffer.from(this._auth.credentials.user + '', 'utf-8').toString('base64'));
    }
    /**
     * Handle the response for AUTH CRAM-MD5 command. We are expecting
     * '334 <challenge string>'. Data to be sent as response needs to be
     * base64 decoded challenge string, MD5 hashed using the password as
     * a HMAC key, prefixed by the username and a space, and finally all
     * base64 encoded again.
     *
     * @param str Message from the server
     */
    _actionAUTH_CRAM_MD5(str, callback) {
        const challengeMatch = str.match(/^334\s+(.+)$/);
        if (!challengeMatch) {
            return callback(this._formatError('Invalid login sequence while waiting for server challenge string', 'EAUTH', str, 'AUTH CRAM-MD5'));
        }
        // Decode from base64
        const base64decoded = Buffer.from(challengeMatch[1], 'base64').toString('ascii');
        const hmacMD5 = node_crypto_1.default.createHmac('md5', this._auth.credentials.pass);
        hmacMD5.update(base64decoded);
        const prepended = this._auth.credentials.user + ' ' + hmacMD5.digest('hex');
        this._responseActions.push(str => {
            this._actionAUTH_CRAM_MD5_PASS(str, callback);
        });
        this._sendCommand(Buffer.from(prepended).toString('base64'), 
        // hidden hash for logs
        Buffer.from(this._auth.credentials.user + ' /* secret */').toString('base64'));
    }
    /**
     * Handles the response to CRAM-MD5 authentication, if there's no error,
     * the user can be considered logged in. Start waiting for a message to send
     *
     * @param str Message from the server
     */
    _actionAUTH_CRAM_MD5_PASS(str, callback) {
        if (!str.match(/^235\s+/)) {
            return callback(this._formatError('Invalid login sequence while waiting for "235"', 'EAUTH', str, 'AUTH CRAM-MD5'));
        }
        this.logger.info({
            tnx: 'smtp',
            username: this._auth.user,
            action: 'authenticated',
            method: this._authMethod
        }, 'User %s authenticated', JSON.stringify(this._auth.user));
        this.authenticated = true;
        callback(null, true);
    }
    /**
     * Handle the response for AUTH LOGIN command. We are expecting
     * '334 UGFzc3dvcmQ6' (base64 for 'Password:'). Data to be sent as
     * response needs to be base64 encoded password.
     *
     * @param str Message from the server
     */
    _actionAUTH_LOGIN_PASS(str, callback) {
        if (!/^334[ -]/.test(str)) {
            // expecting '334 UGFzc3dvcmQ6'
            return callback(this._formatError('Invalid login sequence while waiting for "334 UGFzc3dvcmQ6"', 'EAUTH', str, 'AUTH LOGIN'));
        }
        this._responseActions.push(str => {
            this._actionAUTHComplete(str, callback);
        });
        this._sendCommand(Buffer.from((this._auth.credentials.pass || '').toString(), 'utf-8').toString('base64'), 
        // Hidden pass for logs
        Buffer.from('/* secret */', 'utf-8').toString('base64'));
    }
    /**
     * Handles the response for authentication, if there's no error,
     * the user can be considered logged in. Start waiting for a message to send
     *
     * @param str Message from the server
     */
    _actionAUTHComplete(str, isRetry, callback) {
        if (!callback && typeof isRetry === 'function') {
            callback = isRetry;
            isRetry = false;
        }
        if (str.substr(0, 3) === '334') {
            this._responseActions.push(str => {
                if (isRetry || this._authMethod !== 'XOAUTH2') {
                    this._actionAUTHComplete(str, true, callback);
                }
                else {
                    // fetch a new OAuth2 access token
                    setImmediate(() => this._handleXOauth2Token(true, callback));
                }
            });
            this._sendCommand('');
            return;
        }
        if (str.charAt(0) !== '2') {
            this.logger.info({
                tnx: 'smtp',
                username: this._auth.user,
                action: 'authfail',
                method: this._authMethod
            }, 'User %s failed to authenticate', JSON.stringify(this._auth.user));
            return callback(this._formatError('Invalid login', 'EAUTH', str, 'AUTH ' + this._authMethod));
        }
        this.logger.info({
            tnx: 'smtp',
            username: this._auth.user,
            action: 'authenticated',
            method: this._authMethod
        }, 'User %s authenticated', JSON.stringify(this._auth.user));
        this.authenticated = true;
        callback(null, true);
    }
    /**
     * Handle response for a MAIL FROM: command
     *
     * @param str Message from the server
     */
    _actionMAIL(str, callback) {
        const envelope = this._envelope;
        if (Number(str.charAt(0)) !== 2) {
            const message = this._usingSmtpUtf8 && /^550 /.test(str) && /[\x80-\uFFFF]/.test(envelope.from)
                ? 'Internationalized mailbox name not allowed'
                : 'Mail command failed';
            return callback(this._formatError(message, 'EENVELOPE', str, 'MAIL FROM'));
        }
        if (!envelope.rcptQueue.length) {
            return callback(this._formatError("Can't send mail - no recipients defined", 'EENVELOPE', false, 'API'));
        }
        this._recipientQueue = [];
        const usePipelining = this._supportedExtensions.includes('PIPELINING');
        do {
            const curRecipient = envelope.rcptQueue.shift();
            this._recipientQueue.push(curRecipient);
            this._responseActions.push(str => {
                this._actionRCPT(str, callback);
            });
            this._sendCommand('RCPT TO:<' + curRecipient + '>' + this._getDsnRcptToArgs());
        } while (usePipelining && envelope.rcptQueue.length);
    }
    /**
     * Handle response for a RCPT TO: command
     *
     * @param str Message from the server
     */
    _actionRCPT(str, callback) {
        const envelope = this._envelope;
        let err;
        const curRecipient = this._recipientQueue.shift();
        if (Number(str.charAt(0)) !== 2) {
            // this is a soft error
            const message = this._usingSmtpUtf8 && /^553 /.test(str) && /[\x80-\uFFFF]/.test(curRecipient)
                ? 'Internationalized mailbox name not allowed'
                : 'Recipient command failed';
            envelope.rejected.push(curRecipient);
            // store error for the failed recipient
            err = this._formatError(message, 'EENVELOPE', str, 'RCPT TO');
            err.recipient = curRecipient;
            envelope.rejectedErrors.push(err);
        }
        else {
            envelope.accepted.push(curRecipient);
        }
        if (!envelope.rcptQueue.length && !this._recipientQueue.length) {
            if (envelope.rejected.length < envelope.to.length) {
                this._responseActions.push(str => {
                    this._actionDATA(str, callback);
                });
                this._sendCommand('DATA');
            }
            else {
                err = this._formatError("Can't send mail - all recipients were rejected", 'EENVELOPE', str, 'RCPT TO');
                err.rejected = envelope.rejected;
                err.rejectedErrors = envelope.rejectedErrors;
                return callback(err);
            }
        }
        else if (envelope.rcptQueue.length) {
            const nextRecipient = envelope.rcptQueue.shift();
            this._recipientQueue.push(nextRecipient);
            this._responseActions.push(str => {
                this._actionRCPT(str, callback);
            });
            this._sendCommand('RCPT TO:<' + nextRecipient + '>' + this._getDsnRcptToArgs());
        }
    }
    /**
     * Handle response for a DATA command
     *
     * @param str Message from the server
     */
    _actionDATA(str, callback) {
        const envelope = this._envelope;
        // response should be 354 but according to this issue https://github.com/eleith/emailjs/issues/24
        // some servers might use 250 instead, so lets check for 2 or 3 as the first digit
        if (!/^[23]/.test(str)) {
            return callback(this._formatError('Data command failed', 'EENVELOPE', str, 'DATA'));
        }
        const response = {
            accepted: envelope.accepted,
            rejected: envelope.rejected
        };
        if (this._ehloLines && this._ehloLines.length) {
            response.ehlo = this._ehloLines;
        }
        if (envelope.rejectedErrors.length) {
            response.rejectedErrors = envelope.rejectedErrors;
        }
        callback(null, response);
    }
    /**
     * Handle response for a DATA stream when using SMTP
     * We expect a single response that defines if the sending succeeded or failed
     *
     * @param str Message from the server
     */
    _actionSMTPStream(str, callback) {
        if (Number(str.charAt(0)) !== 2) {
            return callback(this._formatError('Message failed', 'EMESSAGE', str, 'DATA'));
        }
        return callback(null, str);
    }
    /**
     * Handle response for a DATA stream
     * We expect a separate response for every recipient. All recipients can either
     * succeed or fail separately
     *
     * @param recipient The recipient this response applies to
     * @param final Is this the final recipient?
     * @param str Message from the server
     */
    _actionLMTPStream(recipient, final, str, callback) {
        const envelope = this._envelope;
        let err;
        if (Number(str.charAt(0)) !== 2) {
            // Message failed
            err = this._formatError('Message failed for recipient ' + recipient, 'EMESSAGE', str, 'DATA');
            err.recipient = recipient;
            envelope.rejected.push(recipient);
            envelope.rejectedErrors.push(err);
            for (let i = 0, len = envelope.accepted.length; i < len; i++) {
                if (envelope.accepted[i] === recipient) {
                    envelope.accepted.splice(i, 1);
                }
            }
        }
        if (final) {
            return callback(null, str);
        }
    }
    _handleXOauth2Token(isRetry, callback) {
        this._auth.oauth2.getToken(isRetry, (err, accessToken) => {
            if (err) {
                this.logger.info({
                    tnx: 'smtp',
                    username: this._auth.user,
                    action: 'authfail',
                    method: this._authMethod
                }, 'User %s failed to authenticate', JSON.stringify(this._auth.user));
                return callback(this._formatError(err, 'EAUTH', false, 'AUTH XOAUTH2'));
            }
            this._responseActions.push(str => {
                this._actionAUTHComplete(str, isRetry, callback);
            });
            this._sendCommand('AUTH XOAUTH2 ' + this._auth.oauth2.buildXOAuth2Token(accessToken), 
            //  Hidden for logs
            'AUTH XOAUTH2 ' + this._auth.oauth2.buildXOAuth2Token('/* secret */'));
        });
    }
    /**
     *
     * @param command
     * @private
     */
    _isDestroyedMessage(command) {
        if (this._destroyed) {
            return 'Cannot ' + command + ' - smtp connection is already destroyed.';
        }
        if (this._socket) {
            if (this._socket.destroyed) {
                return 'Cannot ' + command + ' - smtp connection socket is already destroyed.';
            }
            if (!this._socket.writable) {
                return 'Cannot ' + command + ' - smtp connection socket is already half-closed.';
            }
        }
    }
    _getHostname() {
        // defaul hostname is machine hostname or [IP]
        let defaultHostname;
        try {
            defaultHostname = node_os_1.default.hostname() || '';
        }
        catch (_err) {
            // fails on windows 7
            defaultHostname = 'localhost';
        }
        // ignore if not FQDN
        if (!defaultHostname || defaultHostname.indexOf('.') < 0) {
            defaultHostname = '[127.0.0.1]';
        }
        // IP should be enclosed in []
        if (defaultHostname.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
            defaultHostname = '[' + defaultHostname + ']';
        }
        return defaultHostname;
    }
}
exports["default"] = SMTPConnection;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 5013:
/***/ (function(module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const node_events_1 = __nccwpck_require__(8474);
const pool_resource_js_1 = __importDefault(__nccwpck_require__(1740));
const index_js_1 = __importDefault(__nccwpck_require__(6619));
const index_js_2 = __importDefault(__nccwpck_require__(5602));
const shared = __importStar(__nccwpck_require__(9893));
const errors = __importStar(__nccwpck_require__(932));
const packageData = __importStar(__nccwpck_require__(5552));
/**
 * Creates a SMTP pool transport object for Nodemailer
 *
 * @constructor
 * @param options SMTP Connection options
 */
class SMTPPool extends node_events_1.EventEmitter {
    constructor(options) {
        super();
        options = options || {};
        if (typeof options === 'string') {
            options = {
                url: options
            };
        }
        let urlData;
        let service = options.service;
        if (typeof options.getSocket === 'function') {
            this.getSocket = options.getSocket;
        }
        if (options.url) {
            urlData = shared.parseConnectionUrl(options.url);
            service = service || urlData.service;
        }
        this.options = shared.assign(false, // create new object
        options, // regular options
        urlData, // url options
        (service && (0, index_js_2.default)(service)) // wellknown options
        );
        this.options.maxConnections = this.options.maxConnections || 5;
        this.options.maxMessages = this.options.maxMessages || 100;
        this.logger = shared.getLogger(this.options, {
            component: this.options.component || 'smtp-pool'
        });
        this.name = 'SMTP (pool)';
        this.version = packageData.version + '[client:' + packageData.version + ']';
        this._rateLimit = {
            counter: 0,
            timeout: null,
            waiting: [],
            checkpoint: false,
            delta: Number(this.options.rateDelta) || 1000,
            limit: Number(this.options.rateLimit) || 0
        };
        this._closed = false;
        this._queue = [];
        this._connections = [];
        this._connectionCounter = 0;
        this.idling = true;
        setImmediate(() => {
            if (this.idling) {
                this.emit('idle');
            }
        });
    }
    /**
     * Placeholder function for creating proxy sockets. This method immediatelly returns
     * without a socket
     *
     * @param options Connection options
     * @param callback Callback function to run with the socket keys
     */
    getSocket(options, callback) {
        // return immediatelly
        setImmediate(() => callback(null, false));
    }
    /**
     * Queues an e-mail to be sent using the selected settings
     *
     * @param mail Mail object
     * @param callback Callback function
     */
    send(mail, callback) {
        if (this._closed) {
            return false;
        }
        this._queue.push({
            mail,
            requeueAttempts: 0,
            callback
        });
        if (this.idling && this._queue.length >= this.options.maxConnections) {
            this.idling = false;
        }
        setImmediate(() => this._processMessages());
        return true;
    }
    /**
     * Closes all connections in the pool. If there is a message being sent, the connection
     * is closed later
     */
    close() {
        let connection;
        const len = this._connections.length;
        this._closed = true;
        // clear rate limit timer if it exists
        clearTimeout(this._rateLimit.timeout);
        if (!len && !this._queue.length) {
            return;
        }
        // remove all available connections
        for (let i = len - 1; i >= 0; i--) {
            if (this._connections[i] && this._connections[i].available) {
                connection = this._connections[i];
                connection.close();
                this.logger.info({
                    tnx: 'connection',
                    cid: connection.id,
                    action: 'removed'
                }, 'Connection #%s removed', connection.id);
            }
        }
        if (len && !this._connections.length) {
            this.logger.debug({
                tnx: 'connection'
            }, 'All connections removed');
        }
        if (!this._queue.length) {
            return;
        }
        // make sure that entire queue would be cleaned
        const invokeCallbacks = () => {
            if (!this._queue.length) {
                this.logger.debug({
                    tnx: 'connection'
                }, 'Pending queue entries cleared');
                return;
            }
            const entry = this._queue.shift();
            if (entry && typeof entry.callback === 'function') {
                try {
                    entry.callback(new Error('Connection pool was closed'));
                }
                catch (E) {
                    // the queue is drained without a connection, so there is no cid to log
                    this.logger.error({
                        err: E,
                        tnx: 'callback'
                    }, 'Callback error: %s', E.message);
                }
            }
            setImmediate(invokeCallbacks);
        };
        setImmediate(invokeCallbacks);
    }
    /**
     * Check the queue and available connections. If there is a message to be sent and there is
     * an available connection, then use this connection to send the mail
     */
    _processMessages() {
        // do nothing if already closed
        if (this._closed) {
            return;
        }
        // do nothing if queue is empty
        if (!this._queue.length) {
            if (!this.idling) {
                // no pending jobs
                this.idling = true;
                this.emit('idle');
            }
            return;
        }
        // find first available connection
        let connection = this._connections.find(c => c.available);
        if (!connection && this._connections.length < this.options.maxConnections) {
            connection = this._createConnection();
        }
        if (!connection) {
            // no more free connection slots available
            this.idling = false;
            return;
        }
        // check if there is free space in the processing queue
        if (!this.idling && this._queue.length < this.options.maxConnections) {
            this.idling = true;
            this.emit('idle');
        }
        const entry = (connection.queueEntry = this._queue.shift());
        entry.messageId = (connection.queueEntry.mail.message.getHeader('message-id') || '').replace(/[<>\s]/g, '');
        connection.available = false;
        this.logger.debug({
            tnx: 'pool',
            cid: connection.id,
            messageId: entry.messageId,
            action: 'assign'
        }, 'Assigned message <%s> to #%s (%s)', entry.messageId, connection.id, connection.messages + 1);
        if (this._rateLimit.limit) {
            this._rateLimit.counter++;
            if (!this._rateLimit.checkpoint) {
                this._rateLimit.checkpoint = Date.now();
            }
        }
        connection.send(entry.mail, (err, info) => {
            // only process callback if current handler is not changed
            if (entry === connection.queueEntry) {
                try {
                    entry.callback(err, info);
                }
                catch (E) {
                    this.logger.error({
                        err: E,
                        tnx: 'callback',
                        cid: connection.id
                    }, 'Callback error for #%s: %s', connection.id, E.message);
                }
                connection.queueEntry = false;
            }
        });
    }
    /**
     * Creates a new pool resource
     */
    _createConnection() {
        const connection = new pool_resource_js_1.default(this);
        connection.id = ++this._connectionCounter;
        this.logger.info({
            tnx: 'pool',
            cid: connection.id,
            action: 'conection'
        }, 'Created new pool resource #%s', connection.id);
        // resource comes available
        connection.on('available', () => {
            this.logger.debug({
                tnx: 'connection',
                cid: connection.id,
                action: 'available'
            }, 'Connection #%s became available', connection.id);
            if (this._closed) {
                // if already closed run close() that will remove this connections from connections list
                this.close();
            }
            else {
                // check if there's anything else to send
                this._processMessages();
            }
        });
        // resource is terminated with an error
        connection.once('error', (err) => {
            if (err.code !== errors.EMAXLIMIT) {
                this.logger.warn({
                    err,
                    tnx: 'pool',
                    cid: connection.id
                }, 'Pool Error for #%s: %s', connection.id, err.message);
            }
            else {
                this.logger.debug({
                    tnx: 'pool',
                    cid: connection.id,
                    action: 'maxlimit'
                }, 'Max messages limit exchausted for #%s', connection.id);
            }
            if (connection.queueEntry) {
                try {
                    connection.queueEntry.callback(err);
                }
                catch (E) {
                    this.logger.error({
                        err: E,
                        tnx: 'callback',
                        cid: connection.id
                    }, 'Callback error for #%s: %s', connection.id, E.message);
                }
                connection.queueEntry = false;
            }
            // remove the erroneus connection from connections list
            this._removeConnection(connection);
            this._continueProcessing();
        });
        connection.once('close', () => {
            this.logger.info({
                tnx: 'connection',
                cid: connection.id,
                action: 'closed'
            }, 'Connection #%s was closed', connection.id);
            this._removeConnection(connection);
            if (connection.queueEntry) {
                // If the connection closed when sending, add the message to the queue again
                // if max number of requeues is not reached yet
                // Note that we must wait a bit.. because the callback of the 'error' handler might be called
                // in the next event loop
                setTimeout(() => {
                    if (connection.queueEntry) {
                        if (this._shouldRequeuOnConnectionClose(connection.queueEntry)) {
                            this._requeueEntryOnConnectionClose(connection);
                        }
                        else {
                            this._failDeliveryOnConnectionClose(connection);
                        }
                    }
                    this._continueProcessing();
                }, 50);
            }
            else {
                if (!this._closed && this.idling && !this._connections.length) {
                    this.emit('clear');
                }
                this._continueProcessing();
            }
        });
        this._connections.push(connection);
        return connection;
    }
    _shouldRequeuOnConnectionClose(queueEntry) {
        if (this.options.maxRequeues === undefined || this.options.maxRequeues < 0) {
            return true;
        }
        return queueEntry.requeueAttempts < this.options.maxRequeues;
    }
    _failDeliveryOnConnectionClose(connection) {
        if (connection.queueEntry && connection.queueEntry.callback) {
            try {
                connection.queueEntry.callback(new Error('Reached maximum number of retries after connection was closed'));
            }
            catch (E) {
                this.logger.error({
                    err: E,
                    tnx: 'callback',
                    messageId: connection.queueEntry.messageId,
                    cid: connection.id
                }, 'Callback error for #%s: %s', connection.id, E.message);
            }
            connection.queueEntry = false;
        }
    }
    _requeueEntryOnConnectionClose(connection) {
        connection.queueEntry.requeueAttempts += 1;
        this.logger.debug({
            tnx: 'pool',
            cid: connection.id,
            messageId: connection.queueEntry.messageId,
            action: 'requeue'
        }, 'Re-queued message <%s> for #%s. Attempt: #%s', connection.queueEntry.messageId, connection.id, connection.queueEntry.requeueAttempts);
        this._queue.unshift(connection.queueEntry);
        connection.queueEntry = false;
    }
    /**
     * Continue to process message if the pool hasn't closed
     */
    _continueProcessing() {
        if (this._closed) {
            this.close();
        }
        else {
            setTimeout(() => this._processMessages(), 100);
        }
    }
    /**
     * Remove resource from pool
     *
     * @param connection The PoolResource to remove
     */
    _removeConnection(connection) {
        const index = this._connections.indexOf(connection);
        if (index !== -1) {
            this._connections.splice(index, 1);
        }
    }
    /**
     * Checks if connections have hit current rate limit and if so, queues the availability callback
     *
     * @param callback Callback function to run once rate limiter has been cleared
     */
    _checkRateLimit(callback) {
        if (!this._rateLimit.limit) {
            return callback();
        }
        const now = Date.now();
        if (this._rateLimit.counter < this._rateLimit.limit) {
            return callback();
        }
        this._rateLimit.waiting.push(callback);
        if (this._rateLimit.checkpoint <= now - this._rateLimit.delta) {
            return this._clearRateLimit();
        }
        if (!this._rateLimit.timeout) {
            this._rateLimit.timeout = setTimeout(() => this._clearRateLimit(), this._rateLimit.delta - (now - this._rateLimit.checkpoint));
            this._rateLimit.checkpoint = now;
        }
    }
    /**
     * Clears current rate limit limitation and runs paused callback
     */
    _clearRateLimit() {
        clearTimeout(this._rateLimit.timeout);
        this._rateLimit.timeout = null;
        this._rateLimit.counter = 0;
        this._rateLimit.checkpoint = false;
        // resume all paused connections
        while (this._rateLimit.waiting.length) {
            const cb = this._rateLimit.waiting.shift();
            setImmediate(cb);
        }
    }
    /**
     * Returns true if there are free slots in the queue
     */
    isIdle() {
        return this.idling;
    }
    verify(callback) {
        let promise;
        if (!callback) {
            promise = new Promise((resolve, reject) => {
                callback = shared.callbackPromise(resolve, reject);
            });
        }
        const auth = new pool_resource_js_1.default(this).auth;
        this.getSocket(this.options, (err, socketOptions) => {
            if (err) {
                return callback(err);
            }
            let options = this.options;
            if (socketOptions && socketOptions.connection) {
                this.logger.info({
                    tnx: 'proxy',
                    remoteAddress: socketOptions.connection.remoteAddress,
                    remotePort: socketOptions.connection.remotePort,
                    destHost: options.host || '',
                    destPort: options.port || '',
                    action: 'connected'
                }, 'Using proxied socket from %s:%s to %s:%s', socketOptions.connection.remoteAddress, socketOptions.connection.remotePort, options.host || '', options.port || '');
                options = Object.assign(shared.assign(false, options), socketOptions);
            }
            const connection = new index_js_1.default(options);
            let returned = false;
            connection.once('error', err => {
                if (returned) {
                    return;
                }
                returned = true;
                connection.close();
                return callback(err);
            });
            connection.once('end', () => {
                if (returned) {
                    return;
                }
                returned = true;
                return callback(new Error('Connection closed'));
            });
            const finalize = () => {
                if (returned) {
                    return;
                }
                returned = true;
                connection.quit();
                return callback(null, true);
            };
            connection.connect(() => {
                if (returned) {
                    return;
                }
                if (auth && (connection.allowsAuth || options.forceAuth)) {
                    connection.login(auth, err => {
                        if (returned) {
                            return;
                        }
                        if (err) {
                            returned = true;
                            connection.close();
                            return callback(err);
                        }
                        finalize();
                    });
                }
                else if (!auth && connection.allowsAuth && options.forceAuth) {
                    const err = new Error('Authentication info was not provided');
                    err.code = errors.ENOAUTH;
                    returned = true;
                    connection.close();
                    return callback(err);
                }
                else {
                    finalize();
                }
            });
        });
        return promise;
    }
}
exports["default"] = SMTPPool;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 1740:
/***/ (function(module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const index_js_1 = __importDefault(__nccwpck_require__(6619));
const index_js_2 = __nccwpck_require__(9893);
const index_js_3 = __importDefault(__nccwpck_require__(2339));
const errors = __importStar(__nccwpck_require__(932));
const node_events_1 = __nccwpck_require__(8474);
/**
 * Creates an element for the pool
 *
 * @constructor
 * @param pool SMTPPool instance
 */
class PoolResource extends node_events_1.EventEmitter {
    constructor(pool) {
        super();
        this.pool = pool;
        this.options = pool.options;
        this.logger = this.pool.logger;
        if (this.options.auth) {
            switch ((this.options.auth.type || '').toString().toUpperCase()) {
                case 'OAUTH2': {
                    const oauth2 = new index_js_3.default(this.options.auth, this.logger);
                    oauth2.provisionCallback =
                        (this.pool.mailer && this.pool.mailer.get('oauth2_provision_cb')) || oauth2.provisionCallback;
                    this.auth = {
                        type: 'OAUTH2',
                        user: this.options.auth.user,
                        oauth2,
                        method: 'XOAUTH2'
                    };
                    oauth2.on('token', (token) => this.pool.mailer.emit('token', token));
                    oauth2.on('error', err => this.emit('error', err));
                    break;
                }
                default:
                    if (!this.options.auth.user && !this.options.auth.pass) {
                        break;
                    }
                    this.auth = {
                        type: (this.options.auth.type || '').toString().toUpperCase() || 'LOGIN',
                        user: this.options.auth.user,
                        credentials: {
                            user: this.options.auth.user || '',
                            pass: this.options.auth.pass,
                            options: this.options.auth.options
                        },
                        method: (this.options.auth.method || '').trim().toUpperCase() || this.options.authMethod || false
                    };
            }
        }
        this._connection = false;
        this._connected = false;
        this.messages = 0;
        this.available = true;
    }
    /**
     * Initiates a connection to the SMTP server
     *
     * @param callback Callback function to run once the connection is established or failed
     */
    connect(callback) {
        this.pool.getSocket(this.options, (err, socketOptions) => {
            if (err) {
                // nothing was connected, so no 'close' event is coming that would free the
                // slot this resource holds in the pool, report the failure the way a failed
                // login does
                this.emit('error', err);
                return callback(err);
            }
            let returned = false;
            let options = this.options;
            if (socketOptions && socketOptions.connection) {
                this.logger.info({
                    tnx: 'proxy',
                    remoteAddress: socketOptions.connection.remoteAddress,
                    remotePort: socketOptions.connection.remotePort,
                    destHost: options.host || '',
                    destPort: options.port || '',
                    action: 'connected'
                }, 'Using proxied socket from %s:%s to %s:%s', socketOptions.connection.remoteAddress, socketOptions.connection.remotePort, options.host || '', options.port || '');
                options = Object.assign((0, index_js_2.assign)(false, options), socketOptions);
            }
            this.connection = new index_js_1.default(options);
            this.connection.once('error', err => {
                this.emit('error', err);
                if (returned) {
                    return;
                }
                returned = true;
                return callback(err);
            });
            this.connection.once('end', () => {
                this.close();
                if (returned) {
                    return;
                }
                returned = true;
                const timer = setTimeout(() => {
                    if (returned) {
                        return;
                    }
                    // still have not returned, this means we have an unexpected connection close
                    const err = new Error('Unexpected socket close');
                    if (this.connection &&
                        this.connection._socket &&
                        this.connection._socket.upgrading) {
                        // starttls connection errors
                        err.code = errors.ETLS;
                    }
                    callback(err);
                }, 1000);
                try {
                    timer.unref();
                }
                catch (_E) {
                    // Ignore. Happens on envs with non-node timer implementation
                }
            });
            this.connection.connect(() => {
                if (returned) {
                    return;
                }
                if (this.auth && (this.connection.allowsAuth || options.forceAuth)) {
                    this.connection.login(this.auth, err => {
                        if (returned) {
                            return;
                        }
                        returned = true;
                        if (err) {
                            this.connection.close();
                            this.emit('error', err);
                            return callback(err);
                        }
                        this._connected = true;
                        callback(null, true);
                    });
                }
                else {
                    returned = true;
                    this._connected = true;
                    return callback(null, true);
                }
            });
        });
    }
    /**
     * Sends an e-mail to be sent using the selected settings
     *
     * @param mail Mail object
     * @param callback Callback function
     */
    send(mail, callback) {
        if (!this._connected) {
            return this.connect(err => {
                if (err) {
                    return callback(err);
                }
                return this.send(mail, callback);
            });
        }
        const envelope = mail.message.getEnvelope();
        const messageId = mail.message.messageId();
        const recipients = [].concat(envelope.to || []);
        if (recipients.length > 3) {
            recipients.push('...and ' + recipients.splice(2).length + ' more');
        }
        this.logger.info({
            tnx: 'send',
            messageId,
            cid: this.id
        }, 'Sending message %s using #%s to <%s>', messageId, this.id, recipients.join(', '));
        if (mail.data.dsn) {
            envelope.dsn = mail.data.dsn;
        }
        // RFC 8689: Pass requireTLSExtensionEnabled to envelope for MAIL FROM parameter
        if (mail.data.requireTLSExtensionEnabled) {
            envelope.requireTLSExtensionEnabled = mail.data.requireTLSExtensionEnabled;
        }
        this.connection.send(envelope, mail.message.createReadStream(), (err, info) => {
            this.messages++;
            if (err) {
                this.connection.close();
                this.emit('error', err);
                return callback(err);
            }
            info.envelope = {
                from: envelope.from,
                to: envelope.to
            };
            info.messageId = messageId;
            setImmediate(() => {
                if (this.messages >= this.options.maxMessages) {
                    const err = new Error('Resource exhausted');
                    err.code = errors.EMAXLIMIT;
                    this.connection.close();
                    this.emit('error', err);
                }
                else {
                    this.pool._checkRateLimit(() => {
                        this.available = true;
                        this.emit('available');
                    });
                }
            });
            callback(null, info);
        });
    }
    /**
     * Closes the connection
     */
    close() {
        this._connected = false;
        if (this.auth && this.auth.oauth2) {
            this.auth.oauth2.removeAllListeners();
        }
        if (this.connection) {
            this.connection.close();
        }
        this.emit('close');
    }
}
exports["default"] = PoolResource;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 284:
/***/ (function(module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const node_events_1 = __nccwpck_require__(8474);
const index_js_1 = __importDefault(__nccwpck_require__(6619));
const index_js_2 = __importDefault(__nccwpck_require__(5602));
const shared = __importStar(__nccwpck_require__(9893));
const index_js_3 = __importDefault(__nccwpck_require__(2339));
const errors = __importStar(__nccwpck_require__(932));
const packageData = __importStar(__nccwpck_require__(5552));
/**
 * Creates a SMTP transport object for Nodemailer
 *
 * @constructor
 * @param options Connection options
 */
class SMTPTransport extends node_events_1.EventEmitter {
    constructor(options) {
        super();
        options = options || {};
        if (typeof options === 'string') {
            options = {
                url: options
            };
        }
        let urlData;
        let service = options.service;
        if (typeof options.getSocket === 'function') {
            this.getSocket = options.getSocket;
        }
        if (options.url) {
            urlData = shared.parseConnectionUrl(options.url);
            service = service || urlData.service;
        }
        this.options = shared.assign(false, // create new object
        options, // regular options
        urlData, // url options
        (service && (0, index_js_2.default)(service)) // wellknown options
        );
        this.logger = shared.getLogger(this.options, {
            component: this.options.component || 'smtp-transport'
        });
        this.name = 'SMTP';
        this.version = packageData.version + '[client:' + packageData.version + ']';
        if (this.options.auth) {
            this.auth = this.getAuth({});
        }
    }
    /**
     * Placeholder function for creating proxy sockets. This method immediatelly returns
     * without a socket
     *
     * @param options Connection options
     * @param callback Callback function to run with the socket keys
     */
    getSocket(options, callback) {
        // return immediatelly
        setImmediate(() => callback(null, false));
    }
    getAuth(authOpts) {
        if (!authOpts) {
            if (this.auth && this.auth.oauth2 && this.mailer) {
                // Transport-level auth is resolved in the constructor, before the Mail wrapper
                // assigns `this.mailer`, so a provision callback registered with
                // `transporter.set('oauth2_provision_cb', ...)` has to be re-checked here
                this.auth.oauth2.provisionCallback = this.mailer.get('oauth2_provision_cb') || this.auth.oauth2.provisionCallback;
            }
            return this.auth;
        }
        const authData = Object.assign({}, this.options.auth && typeof this.options.auth === 'object' ? this.options.auth : {}, typeof authOpts === 'object' ? authOpts : {});
        if (Object.keys(authData).length === 0) {
            return false;
        }
        switch ((authData.type || '').toString().toUpperCase()) {
            case 'OAUTH2': {
                if (!authData.service && !authData.user) {
                    return false;
                }
                const oauth2 = new index_js_3.default(authData, this.logger);
                oauth2.provisionCallback = (this.mailer && this.mailer.get('oauth2_provision_cb')) || oauth2.provisionCallback;
                oauth2.on('token', (token) => this.mailer.emit('token', token));
                oauth2.on('error', err => this.emit('error', err));
                return {
                    type: 'OAUTH2',
                    user: authData.user,
                    oauth2,
                    method: 'XOAUTH2'
                };
            }
            default:
                return {
                    type: (authData.type || '').toString().toUpperCase() || 'LOGIN',
                    user: authData.user,
                    credentials: {
                        user: authData.user || '',
                        pass: authData.pass,
                        options: authData.options
                    },
                    method: (authData.method || '').trim().toUpperCase() || this.options.authMethod || false
                };
        }
    }
    /**
     * Sends an e-mail using the selected settings
     *
     * @param mail Mail object
     * @param callback Callback function
     */
    send(mail, callback) {
        this.getSocket(this.options, (err, socketOptions) => {
            if (err) {
                return callback(err);
            }
            let returned = false;
            let options = this.options;
            if (socketOptions && socketOptions.connection) {
                this.logger.info({
                    tnx: 'proxy',
                    remoteAddress: socketOptions.connection.remoteAddress,
                    remotePort: socketOptions.connection.remotePort,
                    destHost: options.host || '',
                    destPort: options.port || '',
                    action: 'connected'
                }, 'Using proxied socket from %s:%s to %s:%s', socketOptions.connection.remoteAddress, socketOptions.connection.remotePort, options.host || '', options.port || '');
                // only copy options if we need to modify it
                options = Object.assign(shared.assign(false, options), socketOptions);
            }
            const connection = new index_js_1.default(options);
            let perCallAuth;
            const cleanupPerCallAuth = () => {
                if (perCallAuth && perCallAuth !== this.auth && perCallAuth.oauth2) {
                    perCallAuth.oauth2.removeAllListeners();
                }
                perCallAuth = null;
            };
            connection.once('error', err => {
                if (returned) {
                    return;
                }
                returned = true;
                cleanupPerCallAuth();
                connection.close();
                return callback(err);
            });
            connection.once('end', () => {
                if (returned) {
                    return;
                }
                const timer = setTimeout(() => {
                    if (returned) {
                        return;
                    }
                    returned = true;
                    cleanupPerCallAuth();
                    // still have not returned, this means we have an unexpected connection close
                    const err = new Error('Unexpected socket close');
                    if (connection && connection._socket && connection._socket.upgrading) {
                        // starttls connection errors
                        err.code = errors.ETLS;
                    }
                    callback(err);
                }, 1000);
                try {
                    timer.unref();
                }
                catch (_E) {
                    // Ignore. Happens on envs with non-node timer implementation
                }
            });
            const sendMessage = () => {
                const envelope = mail.message.getEnvelope();
                const messageId = mail.message.messageId();
                const recipients = [].concat(envelope.to || []);
                if (recipients.length > 3) {
                    recipients.push('...and ' + recipients.splice(2).length + ' more');
                }
                if (mail.data.dsn) {
                    envelope.dsn = mail.data.dsn;
                }
                // RFC 8689: Pass requireTLSExtensionEnabled to envelope for MAIL FROM parameter
                if (mail.data.requireTLSExtensionEnabled) {
                    envelope.requireTLSExtensionEnabled = mail.data.requireTLSExtensionEnabled;
                }
                this.logger.info({
                    tnx: 'send',
                    messageId
                }, 'Sending message %s to <%s>', messageId, recipients.join(', '));
                connection.send(envelope, mail.message.createReadStream(), (err, info) => {
                    returned = true;
                    cleanupPerCallAuth();
                    connection.close();
                    if (err) {
                        this.logger.error({
                            err,
                            tnx: 'send'
                        }, 'Send error for %s: %s', messageId, err.message);
                        return callback(err);
                    }
                    info.envelope = {
                        from: envelope.from,
                        to: envelope.to
                    };
                    info.messageId = messageId;
                    try {
                        return callback(null, info);
                    }
                    catch (E) {
                        this.logger.error({
                            err: E,
                            tnx: 'callback'
                        }, 'Callback error for %s: %s', messageId, E.message);
                    }
                });
            };
            connection.connect(() => {
                if (returned) {
                    return;
                }
                perCallAuth = this.getAuth(mail.data.auth);
                if (perCallAuth && (connection.allowsAuth || options.forceAuth)) {
                    connection.login(perCallAuth, err => {
                        cleanupPerCallAuth();
                        if (returned) {
                            return;
                        }
                        if (err) {
                            returned = true;
                            connection.close();
                            return callback(err);
                        }
                        sendMessage();
                    });
                }
                else {
                    sendMessage();
                }
            });
        });
    }
    verify(callback) {
        let promise;
        if (!callback) {
            promise = new Promise((resolve, reject) => {
                callback = shared.callbackPromise(resolve, reject);
            });
        }
        this.getSocket(this.options, (err, socketOptions) => {
            if (err) {
                return callback(err);
            }
            let options = this.options;
            if (socketOptions && socketOptions.connection) {
                this.logger.info({
                    tnx: 'proxy',
                    remoteAddress: socketOptions.connection.remoteAddress,
                    remotePort: socketOptions.connection.remotePort,
                    destHost: options.host || '',
                    destPort: options.port || '',
                    action: 'connected'
                }, 'Using proxied socket from %s:%s to %s:%s', socketOptions.connection.remoteAddress, socketOptions.connection.remotePort, options.host || '', options.port || '');
                options = Object.assign(shared.assign(false, options), socketOptions);
            }
            const connection = new index_js_1.default(options);
            let returned = false;
            let perCallAuth;
            const cleanupPerCallAuth = () => {
                if (perCallAuth && perCallAuth !== this.auth && perCallAuth.oauth2) {
                    perCallAuth.oauth2.removeAllListeners();
                }
                perCallAuth = null;
            };
            connection.once('error', err => {
                if (returned) {
                    return;
                }
                returned = true;
                cleanupPerCallAuth();
                connection.close();
                return callback(err);
            });
            connection.once('end', () => {
                if (returned) {
                    return;
                }
                returned = true;
                cleanupPerCallAuth();
                return callback(new Error('Connection closed'));
            });
            const finalize = () => {
                if (returned) {
                    return;
                }
                returned = true;
                cleanupPerCallAuth();
                connection.quit();
                return callback(null, true);
            };
            connection.connect(() => {
                if (returned) {
                    return;
                }
                perCallAuth = this.getAuth({});
                if (perCallAuth && (connection.allowsAuth || options.forceAuth)) {
                    connection.login(perCallAuth, err => {
                        cleanupPerCallAuth();
                        if (returned) {
                            return;
                        }
                        if (err) {
                            returned = true;
                            connection.close();
                            return callback(err);
                        }
                        finalize();
                    });
                }
                else if (!perCallAuth && connection.allowsAuth && options.forceAuth) {
                    const err = new Error('Authentication info was not provided');
                    err.code = errors.ENOAUTH;
                    returned = true;
                    cleanupPerCallAuth();
                    connection.close();
                    return callback(err);
                }
                else {
                    finalize();
                }
            });
        });
        return promise;
    }
    /**
     * Releases resources
     */
    close() {
        if (this.auth && this.auth.oauth2) {
            this.auth.oauth2.removeAllListeners();
        }
        this.emit('close');
    }
}
exports["default"] = SMTPTransport;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 9116:
/***/ (function(module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const packageData = __importStar(__nccwpck_require__(5552));
const shared = __importStar(__nccwpck_require__(9893));
const le_windows_js_1 = __importDefault(__nccwpck_require__(7636));
const le_unix_js_1 = __importDefault(__nccwpck_require__(8367));
/**
 * Generates a Transport object for streaming
 *
 * Possible options can be the following:
 *
 *  * **buffer** if true, then returns the message as a Buffer object instead of a stream
 *  * **newline** either 'windows' or 'unix'
 *
 * @constructor
 * @param optional config parameter
 */
class StreamTransport {
    constructor(options) {
        options = options || {};
        this.options = options;
        this.name = 'StreamTransport';
        this.version = packageData.version;
        this.logger = shared.getLogger(this.options, {
            component: this.options.component || 'stream-transport'
        });
        this.winbreak = ['win', 'windows', 'dos', '\r\n'].includes((options.newline || '').toString().toLowerCase());
    }
    /**
     * Compiles a mailcomposer message and forwards it to handler that sends it
     *
     * @param mail MailComposer object
     * @param done Callback function to run when the sending is completed
     */
    send(mail, done) {
        // We probably need this in the output. send() runs after the message was compiled,
        // so mail.message is set
        mail.message.keepBcc = true;
        const envelope = mail.message.getEnvelope();
        const messageId = mail.message.messageId();
        const recipients = [].concat(envelope.to || []);
        if (recipients.length > 3) {
            recipients.push('...and ' + recipients.splice(2).length + ' more');
        }
        this.logger.info({
            tnx: 'send',
            messageId
        }, 'Sending message %s to <%s> using %s line breaks', messageId, recipients.join(', '), this.winbreak ? '<CR><LF>' : '<LF>');
        setImmediate(() => {
            let stream;
            try {
                stream = mail.message.createReadStream();
                if (this.options.newline) {
                    // apply the transport-level line ending transform; the message-level
                    // `newline` option is handled by MimeNode in createReadStream()
                    const sourceStream = stream;
                    stream = sourceStream.pipe(this.winbreak ? new le_windows_js_1.default() : new le_unix_js_1.default());
                    sourceStream.once('error', err => stream.emit('error', err));
                }
            }
            catch (E) {
                this.logger.error({
                    err: E,
                    tnx: 'send',
                    messageId
                }, 'Creating send stream failed for %s. %s', messageId, E.message);
                return done(E);
            }
            if (!this.options.buffer) {
                stream.once('error', err => {
                    this.logger.error({
                        err,
                        tnx: 'send',
                        messageId
                    }, 'Failed creating message for %s. %s', messageId, err.message);
                });
                return done(null, {
                    envelope,
                    messageId,
                    message: stream
                });
            }
            const chunks = [];
            let chunklen = 0;
            stream.on('readable', () => {
                let chunk;
                while ((chunk = stream.read()) !== null) {
                    chunks.push(chunk);
                    chunklen += chunk.length;
                }
            });
            stream.once('error', err => {
                this.logger.error({
                    err,
                    tnx: 'send',
                    messageId
                }, 'Failed creating message for %s. %s', messageId, err.message);
                return done(err);
            });
            stream.on('end', () => done(null, {
                envelope,
                messageId,
                message: Buffer.concat(chunks, chunklen)
            }));
        });
    }
}
exports["default"] = StreamTransport;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 5602:
/***/ ((module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = wellKnown;
const services_js_1 = __nccwpck_require__(4532);
const normalized = {};
Object.keys(services_js_1.services).forEach(key => {
    const service = services_js_1.services[key];
    const normalizedService = normalizeService(service);
    normalized[normalizeKey(key)] = normalizedService;
    [].concat(service.aliases || []).forEach(alias => {
        normalized[normalizeKey(alias)] = normalizedService;
    });
    [].concat(service.domains || []).forEach(domain => {
        normalized[normalizeKey(domain)] = normalizedService;
    });
});
function normalizeKey(key) {
    return key.replace(/[^a-zA-Z0-9.-]/g, '').toLowerCase();
}
function normalizeService(service) {
    const response = {};
    Object.keys(service).forEach(key => {
        if (!['domains', 'aliases'].includes(key)) {
            response[key] = service[key];
        }
    });
    return response;
}
/**
 * Resolves SMTP config for given key. Key can be a name (like 'Gmail'), alias (like 'Google Mail') or
 * an email address (like 'test@googlemail.com').
 *
 * @param key Service name, alias or an email address
 * @returns SMTP config or false if not found
 */
function wellKnown(key) {
    key = normalizeKey(key.split('@').pop());
    return normalized[key] || false;
}
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ }),

/***/ 4532:
/***/ ((__unused_webpack_module, exports) => {


// Generated by scripts/build.js from services.json. Do not edit by hand.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.services = void 0;
exports.services = {
    "126": {
        "description": "126 Mail (NetEase)",
        "host": "smtp.126.com",
        "port": 465,
        "secure": true
    },
    "163": {
        "description": "163 Mail (NetEase)",
        "host": "smtp.163.com",
        "port": 465,
        "secure": true
    },
    "1und1": {
        "description": "1&1 Mail (German hosting provider)",
        "host": "smtp.1und1.de",
        "port": 465,
        "secure": true,
        "authMethod": "LOGIN"
    },
    "Aliyun": {
        "description": "Alibaba Cloud Mail",
        "domains": [
            "aliyun.com"
        ],
        "host": "smtp.aliyun.com",
        "port": 465,
        "secure": true
    },
    "AliyunQiye": {
        "description": "Alibaba Cloud Enterprise Mail",
        "host": "smtp.qiye.aliyun.com",
        "port": 465,
        "secure": true
    },
    "AOL": {
        "description": "AOL Mail",
        "domains": [
            "aol.com"
        ],
        "host": "smtp.aol.com",
        "port": 587
    },
    "Aruba": {
        "description": "Aruba PEC (Italian email provider)",
        "domains": [
            "aruba.it",
            "pec.aruba.it"
        ],
        "aliases": [
            "Aruba PEC"
        ],
        "host": "smtps.aruba.it",
        "port": 465,
        "secure": true,
        "authMethod": "LOGIN"
    },
    "Bluewin": {
        "description": "Bluewin (Swiss email provider)",
        "host": "smtpauths.bluewin.ch",
        "domains": [
            "bluewin.ch"
        ],
        "port": 465
    },
    "BOL": {
        "description": "BOL Mail (Brazilian provider)",
        "domains": [
            "bol.com.br"
        ],
        "host": "smtp.bol.com.br",
        "port": 587,
        "requireTLS": true
    },
    "DebugMail": {
        "description": "DebugMail (email testing service)",
        "host": "debugmail.io",
        "port": 25
    },
    "Disroot": {
        "description": "Disroot (privacy-focused provider)",
        "domains": [
            "disroot.org"
        ],
        "host": "disroot.org",
        "port": 587,
        "secure": false,
        "authMethod": "LOGIN"
    },
    "DynectEmail": {
        "description": "Dyn Email Delivery",
        "aliases": [
            "Dynect"
        ],
        "host": "smtp.dynect.net",
        "port": 25
    },
    "ElasticEmail": {
        "description": "Elastic Email",
        "aliases": [
            "Elastic Email"
        ],
        "host": "smtp.elasticemail.com",
        "port": 465,
        "secure": true
    },
    "Ethereal": {
        "description": "Ethereal Email (email testing service)",
        "aliases": [
            "ethereal.email"
        ],
        "host": "smtp.ethereal.email",
        "port": 587
    },
    "FastMail": {
        "description": "FastMail",
        "domains": [
            "fastmail.fm"
        ],
        "host": "smtp.fastmail.com",
        "port": 465,
        "secure": true
    },
    "Feishu Mail": {
        "description": "Feishu Mail (Lark)",
        "aliases": [
            "Feishu",
            "FeishuMail"
        ],
        "domains": [
            "www.feishu.cn"
        ],
        "host": "smtp.feishu.cn",
        "port": 465,
        "secure": true
    },
    "Forward Email": {
        "description": "Forward Email (email forwarding service)",
        "aliases": [
            "FE",
            "ForwardEmail"
        ],
        "domains": [
            "forwardemail.net"
        ],
        "host": "smtp.forwardemail.net",
        "port": 465,
        "secure": true
    },
    "GandiMail": {
        "description": "Gandi Mail",
        "aliases": [
            "Gandi",
            "Gandi Mail"
        ],
        "host": "mail.gandi.net",
        "port": 587
    },
    "Gmail": {
        "description": "Gmail",
        "aliases": [
            "Google Mail"
        ],
        "domains": [
            "gmail.com",
            "googlemail.com"
        ],
        "host": "smtp.gmail.com",
        "port": 465,
        "secure": true
    },
    "GmailWorkspace": {
        "description": "Gmail Workspace",
        "aliases": [
            "Google Workspace Mail"
        ],
        "host": "smtp-relay.gmail.com",
        "port": 465,
        "secure": true
    },
    "GMX": {
        "description": "GMX Mail",
        "domains": [
            "gmx.com",
            "gmx.net",
            "gmx.de"
        ],
        "host": "mail.gmx.com",
        "port": 587
    },
    "Godaddy": {
        "description": "GoDaddy Email (US)",
        "host": "smtpout.secureserver.net",
        "port": 25
    },
    "GodaddyAsia": {
        "description": "GoDaddy Email (Asia)",
        "host": "smtp.asia.secureserver.net",
        "port": 25
    },
    "GodaddyEurope": {
        "description": "GoDaddy Email (Europe)",
        "host": "smtp.europe.secureserver.net",
        "port": 25
    },
    "hot.ee": {
        "description": "Hot.ee (Estonian email provider)",
        "host": "mail.hot.ee"
    },
    "Hotmail": {
        "description": "Outlook.com / Hotmail",
        "aliases": [
            "Outlook",
            "Outlook.com",
            "Hotmail.com"
        ],
        "domains": [
            "hotmail.com",
            "outlook.com"
        ],
        "host": "smtp-mail.outlook.com",
        "port": 587
    },
    "iCloud": {
        "description": "iCloud Mail",
        "aliases": [
            "Me",
            "Mac"
        ],
        "domains": [
            "me.com",
            "mac.com"
        ],
        "host": "smtp.mail.me.com",
        "port": 587
    },
    "Infomaniak": {
        "description": "Infomaniak Mail (Swiss hosting provider)",
        "host": "mail.infomaniak.com",
        "domains": [
            "ik.me",
            "ikmail.com",
            "etik.com"
        ],
        "port": 587
    },
    "KolabNow": {
        "description": "KolabNow (secure email service)",
        "domains": [
            "kolabnow.com"
        ],
        "aliases": [
            "Kolab"
        ],
        "host": "smtp.kolabnow.com",
        "port": 465,
        "secure": true,
        "authMethod": "LOGIN"
    },
    "Loopia": {
        "description": "Loopia (Swedish hosting provider)",
        "host": "mailcluster.loopia.se",
        "port": 465
    },
    "Loops": {
        "description": "Loops",
        "host": "smtp.loops.so",
        "port": 587
    },
    "mail.ee": {
        "description": "Mail.ee (Estonian email provider)",
        "host": "smtp.mail.ee"
    },
    "Mail.ru": {
        "description": "Mail.ru",
        "host": "smtp.mail.ru",
        "port": 465,
        "secure": true
    },
    "Mailcatch.app": {
        "description": "Mailcatch (email testing service)",
        "host": "sandbox-smtp.mailcatch.app",
        "port": 2525
    },
    "Maildev": {
        "description": "MailDev (local email testing)",
        "port": 1025,
        "ignoreTLS": true
    },
    "MailerSend": {
        "description": "MailerSend",
        "host": "smtp.mailersend.net",
        "port": 587
    },
    "Mailgun": {
        "description": "Mailgun",
        "host": "smtp.mailgun.org",
        "port": 465,
        "secure": true
    },
    "Mailjet": {
        "description": "Mailjet",
        "host": "in.mailjet.com",
        "port": 587
    },
    "Mailosaur": {
        "description": "Mailosaur (email testing service)",
        "host": "mailosaur.io",
        "port": 25
    },
    "Mailtrap": {
        "description": "Mailtrap",
        "host": "live.smtp.mailtrap.io",
        "port": 587
    },
    "Mandrill": {
        "description": "Mandrill (by Mailchimp)",
        "host": "smtp.mandrillapp.com",
        "port": 587
    },
    "Naver": {
        "description": "Naver Mail (Korean email provider)",
        "host": "smtp.naver.com",
        "port": 587
    },
    "OhMySMTP": {
        "description": "OhMySMTP (email delivery service)",
        "host": "smtp.ohmysmtp.com",
        "port": 587,
        "secure": false
    },
    "One": {
        "description": "One.com Email",
        "host": "send.one.com",
        "port": 465,
        "secure": true
    },
    "OpenMailBox": {
        "description": "OpenMailBox",
        "aliases": [
            "OMB",
            "openmailbox.org"
        ],
        "host": "smtp.openmailbox.org",
        "port": 465,
        "secure": true
    },
    "Outlook365": {
        "description": "Microsoft 365 / Office 365",
        "host": "smtp.office365.com",
        "port": 587,
        "secure": false
    },
    "Postmark": {
        "description": "Postmark",
        "aliases": [
            "PostmarkApp"
        ],
        "host": "smtp.postmarkapp.com",
        "port": 2525
    },
    "Proton": {
        "description": "Proton Mail",
        "aliases": [
            "ProtonMail",
            "Proton.me",
            "Protonmail.com",
            "Protonmail.ch"
        ],
        "domains": [
            "proton.me",
            "protonmail.com",
            "pm.me",
            "protonmail.ch"
        ],
        "host": "smtp.protonmail.ch",
        "port": 587,
        "requireTLS": true
    },
    "qiye.aliyun": {
        "description": "Alibaba Mail Enterprise Edition",
        "host": "smtp.mxhichina.com",
        "port": "465",
        "secure": true
    },
    "QQ": {
        "description": "QQ Mail",
        "domains": [
            "qq.com"
        ],
        "host": "smtp.qq.com",
        "port": 465,
        "secure": true
    },
    "QQex": {
        "description": "QQ Enterprise Mail",
        "aliases": [
            "QQ Enterprise"
        ],
        "domains": [
            "exmail.qq.com"
        ],
        "host": "smtp.exmail.qq.com",
        "port": 465,
        "secure": true
    },
    "Resend": {
        "description": "Resend",
        "host": "smtp.resend.com",
        "port": 465,
        "secure": true
    },
    "Runbox": {
        "description": "Runbox (Norwegian email provider)",
        "domains": [
            "runbox.com"
        ],
        "host": "smtp.runbox.com",
        "port": 465,
        "secure": true
    },
    "SendCloud": {
        "description": "SendCloud (Chinese email delivery)",
        "host": "smtp.sendcloud.net",
        "port": 2525
    },
    "SendGrid": {
        "description": "SendGrid",
        "host": "smtp.sendgrid.net",
        "port": 587
    },
    "SendinBlue": {
        "description": "Brevo (formerly Sendinblue)",
        "aliases": [
            "Brevo"
        ],
        "host": "smtp-relay.brevo.com",
        "port": 587
    },
    "SendPulse": {
        "description": "SendPulse",
        "host": "smtp-pulse.com",
        "port": 465,
        "secure": true
    },
    "SES": {
        "description": "AWS SES US East (N. Virginia)",
        "host": "email-smtp.us-east-1.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "SES-AP-NORTHEAST-1": {
        "description": "AWS SES Asia Pacific (Tokyo)",
        "host": "email-smtp.ap-northeast-1.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "SES-AP-NORTHEAST-2": {
        "description": "AWS SES Asia Pacific (Seoul)",
        "host": "email-smtp.ap-northeast-2.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "SES-AP-NORTHEAST-3": {
        "description": "AWS SES Asia Pacific (Osaka)",
        "host": "email-smtp.ap-northeast-3.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "SES-AP-SOUTH-1": {
        "description": "AWS SES Asia Pacific (Mumbai)",
        "host": "email-smtp.ap-south-1.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "SES-AP-SOUTHEAST-1": {
        "description": "AWS SES Asia Pacific (Singapore)",
        "host": "email-smtp.ap-southeast-1.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "SES-AP-SOUTHEAST-2": {
        "description": "AWS SES Asia Pacific (Sydney)",
        "host": "email-smtp.ap-southeast-2.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "SES-CA-CENTRAL-1": {
        "description": "AWS SES Canada (Central)",
        "host": "email-smtp.ca-central-1.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "SES-EU-CENTRAL-1": {
        "description": "AWS SES Europe (Frankfurt)",
        "host": "email-smtp.eu-central-1.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "SES-EU-NORTH-1": {
        "description": "AWS SES Europe (Stockholm)",
        "host": "email-smtp.eu-north-1.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "SES-EU-WEST-1": {
        "description": "AWS SES Europe (Ireland)",
        "host": "email-smtp.eu-west-1.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "SES-EU-WEST-2": {
        "description": "AWS SES Europe (London)",
        "host": "email-smtp.eu-west-2.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "SES-EU-WEST-3": {
        "description": "AWS SES Europe (Paris)",
        "host": "email-smtp.eu-west-3.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "SES-SA-EAST-1": {
        "description": "AWS SES South America (São Paulo)",
        "host": "email-smtp.sa-east-1.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "SES-US-EAST-1": {
        "description": "AWS SES US East (N. Virginia)",
        "host": "email-smtp.us-east-1.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "SES-US-EAST-2": {
        "description": "AWS SES US East (Ohio)",
        "host": "email-smtp.us-east-2.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "SES-US-GOV-EAST-1": {
        "description": "AWS SES GovCloud (US-East)",
        "host": "email-smtp.us-gov-east-1.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "SES-US-GOV-WEST-1": {
        "description": "AWS SES GovCloud (US-West)",
        "host": "email-smtp.us-gov-west-1.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "SES-US-WEST-1": {
        "description": "AWS SES US West (N. California)",
        "host": "email-smtp.us-west-1.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "SES-US-WEST-2": {
        "description": "AWS SES US West (Oregon)",
        "host": "email-smtp.us-west-2.amazonaws.com",
        "port": 465,
        "secure": true
    },
    "Seznam": {
        "description": "Seznam Email (Czech email provider)",
        "aliases": [
            "Seznam Email"
        ],
        "domains": [
            "seznam.cz",
            "email.cz",
            "post.cz",
            "spoluzaci.cz"
        ],
        "host": "smtp.seznam.cz",
        "port": 465,
        "secure": true
    },
    "SMTP2GO": {
        "description": "SMTP2GO",
        "host": "mail.smtp2go.com",
        "port": 2525
    },
    "Sparkpost": {
        "description": "SparkPost",
        "aliases": [
            "SparkPost",
            "SparkPost Mail"
        ],
        "domains": [
            "sparkpost.com"
        ],
        "host": "smtp.sparkpostmail.com",
        "port": 587,
        "secure": false
    },
    "Tipimail": {
        "description": "Tipimail (email delivery service)",
        "host": "smtp.tipimail.com",
        "port": 587
    },
    "TurboSMTP": {
        "description": "TurboSMTP",
        "host": "pro.turbo-smtp.com",
        "port": 465,
        "secure": true
    },
    "TurboSMTP-EU": {
        "description": "TurboSMTP (EU region)",
        "host": "pro.eu.turbo-smtp.com",
        "port": 465,
        "secure": true
    },
    "Tutanota": {
        "description": "Tutanota (Tuta Mail)",
        "domains": [
            "tutanota.com",
            "tuta.com",
            "tutanota.de",
            "tuta.io"
        ],
        "host": "smtp.tutanota.com",
        "port": 465,
        "secure": true
    },
    "Yahoo": {
        "description": "Yahoo Mail",
        "domains": [
            "yahoo.com"
        ],
        "host": "smtp.mail.yahoo.com",
        "port": 465,
        "secure": true
    },
    "Yandex": {
        "description": "Yandex Mail",
        "domains": [
            "yandex.ru"
        ],
        "host": "smtp.yandex.ru",
        "port": 465,
        "secure": true
    },
    "Zimbra": {
        "description": "Zimbra Mail Server",
        "aliases": [
            "Zimbra Collaboration"
        ],
        "host": "smtp.zimbra.com",
        "port": 587,
        "requireTLS": true
    },
    "Zoho": {
        "description": "Zoho Mail",
        "host": "smtp.zoho.com",
        "port": 465,
        "secure": true,
        "authMethod": "LOGIN"
    }
};


/***/ }),

/***/ 2339:
/***/ (function(module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const node_stream_1 = __nccwpck_require__(7075);
const index_js_1 = __importDefault(__nccwpck_require__(7336));
const node_crypto_1 = __importDefault(__nccwpck_require__(7598));
const shared = __importStar(__nccwpck_require__(9893));
const errors = __importStar(__nccwpck_require__(932));
/**
 * XOAUTH2 access_token generator for Gmail.
 * Create client ID for web applications in Google API console to use it.
 * See Offline Access for receiving the needed refreshToken for an user
 * https://developers.google.com/accounts/docs/OAuth2WebServer#offline
 *
 * Usage for generating access tokens with a custom method using provisionCallback:
 * provisionCallback(user, renew, callback)
 *   * user is the username to get the token for
 *   * renew is a boolean that if true indicates that existing token failed and needs to be renewed
 *   * callback is the callback to run with (error, accessToken [, expires])
 *     * accessToken is a string
 *     * expires is an optional expire time in milliseconds
 * If provisionCallback is used, then Nodemailer does not try to attempt generating the token by itself
 *
 * @constructor
 * @param options Client information for token generation
 * @param options.user User e-mail address
 * @param options.clientId Client ID value
 * @param options.clientSecret Client secret value
 * @param options.refreshToken Refresh token for an user
 * @param options.accessUrl Endpoint for token generation, defaults to 'https://accounts.google.com/o/oauth2/token'
 * @param options.accessToken An existing valid accessToken
 * @param options.privateKey Private key for JSW
 * @param options.expires Optional Access Token expire time in ms
 * @param options.timeout Optional TTL for Access Token in seconds
 * @param options.provisionCallback Function to run when a new access token is required
 * @param options.tls Optional TLS options forwarded to the HTTPS token request. Defaults to strict cert validation; supply { rejectUnauthorized: false } only for self-hosted OAuth providers on private CAs.
 */
class XOAuth2 extends node_stream_1.Stream {
    constructor(options, logger) {
        super();
        this.options = options || {};
        if (options && options.serviceClient) {
            if (!options.privateKey || !options.user) {
                const err = new Error('Options "privateKey" and "user" are required for service account!');
                err.code = errors.EOAUTH2;
                setImmediate(() => this.emit('error', err));
                return;
            }
            const serviceRequestTimeout = Math.min(Math.max(Number(this.options.serviceRequestTimeout) || 0, 0), 3600);
            this.options.serviceRequestTimeout = serviceRequestTimeout || 5 * 60;
        }
        this.logger = shared.getLogger({
            logger
        }, {
            component: this.options.component || 'OAuth2'
        });
        this.provisionCallback = typeof this.options.provisionCallback === 'function' ? this.options.provisionCallback : false;
        this.options.accessUrl = this.options.accessUrl || 'https://accounts.google.com/o/oauth2/token';
        this.options.customHeaders = this.options.customHeaders || {};
        this.options.customParams = this.options.customParams || {};
        this.accessToken = this.options.accessToken || false;
        if (this.options.expires && Number(this.options.expires)) {
            this.expires = this.options.expires;
        }
        else {
            const timeout = Math.max(Number(this.options.timeout) || 0, 0);
            this.expires = (timeout && Date.now() + timeout * 1000) || 0;
        }
        this.renewing = false; // Track if renewal is in progress
        this.renewalQueue = []; // Queue for pending requests during renewal
    }
    /**
     * Returns or generates (if previous has expired) a XOAuth2 token
     *
     * @param renew If false then use cached access token (if available)
     * @param callback Callback function with error object and token string
     */
    getToken(renew, callback) {
        if (!renew && this.accessToken && (!this.expires || this.expires > Date.now())) {
            this.logger.debug({
                tnx: 'OAUTH2',
                user: this.options.user,
                action: 'reuse'
            }, 'Reusing existing access token for %s', this.options.user);
            return callback(null, this.accessToken);
        }
        // check if it is possible to renew, if not, return the current token or error
        if (!this.provisionCallback && !this.options.refreshToken && !this.options.serviceClient) {
            if (this.accessToken) {
                this.logger.debug({
                    tnx: 'OAUTH2',
                    user: this.options.user,
                    action: 'reuse'
                }, 'Reusing existing access token (no refresh capability) for %s', this.options.user);
                return callback(null, this.accessToken);
            }
            this.logger.error({
                tnx: 'OAUTH2',
                user: this.options.user,
                action: 'renew'
            }, 'Cannot renew access token for %s: No refresh mechanism available', this.options.user);
            const err = new Error("Can't create new access token for user");
            err.code = errors.EOAUTH2;
            return callback(err);
        }
        // If renewal already in progress, queue this request instead of starting another
        if (this.renewing) {
            this.renewalQueue.push({ renew, callback });
            return;
        }
        this.renewing = true;
        // Handles token renewal completion - processes queued requests and cleans up
        const generateCallback = (err, accessToken) => {
            this.renewalQueue.forEach(item => item.callback(err, accessToken));
            this.renewalQueue = [];
            this.renewing = false;
            if (err) {
                this.logger.error({
                    err,
                    tnx: 'OAUTH2',
                    user: this.options.user,
                    action: 'renew'
                }, 'Failed generating new Access Token for %s', this.options.user);
            }
            else {
                this.logger.info({
                    tnx: 'OAUTH2',
                    user: this.options.user,
                    action: 'renew'
                }, 'Generated new Access Token for %s', this.options.user);
            }
            // Complete original request
            callback(err, accessToken);
        };
        if (this.provisionCallback) {
            this.provisionCallback(this.options.user, !!renew, (err, accessToken, expires) => {
                if (!err && accessToken) {
                    this.accessToken = accessToken;
                    this.expires = expires || 0;
                }
                generateCallback(err, accessToken);
            });
        }
        else {
            this.generateToken(generateCallback);
        }
    }
    /**
     * Updates token values
     *
     * @param accessToken New access token
     * @param timeout Access token lifetime in seconds
     *
     * Emits 'token': { user: User email-address, accessToken: the new accessToken, timeout: TTL in seconds}
     */
    updateToken(accessToken, timeout) {
        this.accessToken = accessToken;
        timeout = Math.max(Number(timeout) || 0, 0);
        this.expires = (timeout && Date.now() + timeout * 1000) || 0;
        this.emit('token', {
            user: this.options.user,
            accessToken: accessToken || '',
            expires: this.expires
        });
    }
    /**
     * Generates a new XOAuth2 token with the credentials provided at initialization
     *
     * @param callback Callback function with error object and token string
     */
    generateToken(callback) {
        let urlOptions;
        let loggedUrlOptions;
        if (this.options.serviceClient) {
            // service account - https://developers.google.com/identity/protocols/OAuth2ServiceAccount
            const iat = Math.floor(Date.now() / 1000); // unix time
            const tokenData = {
                iss: this.options.serviceClient,
                scope: this.options.scope || 'https://mail.google.com/',
                sub: this.options.user,
                aud: this.options.accessUrl,
                iat,
                exp: iat + this.options.serviceRequestTimeout
            };
            let token;
            try {
                token = this.jwtSignRS256(tokenData);
            }
            catch (_err) {
                const err = new Error("Can't generate token. Check your auth options");
                err.code = errors.EOAUTH2;
                return callback(err);
            }
            urlOptions = {
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: token
            };
            loggedUrlOptions = {
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: tokenData
            };
        }
        else {
            if (!this.options.refreshToken) {
                const err = new Error("Can't create new access token for user");
                err.code = errors.EOAUTH2;
                return callback(err);
            }
            // web app - https://developers.google.com/identity/protocols/OAuth2WebServer
            urlOptions = {
                client_id: this.options.clientId || '',
                client_secret: this.options.clientSecret || '',
                refresh_token: this.options.refreshToken,
                grant_type: 'refresh_token'
            };
            loggedUrlOptions = {
                client_id: this.options.clientId || '',
                client_secret: (this.options.clientSecret || '').substr(0, 6) + '...',
                refresh_token: (this.options.refreshToken || '').substr(0, 6) + '...',
                grant_type: 'refresh_token'
            };
        }
        Object.assign(urlOptions, this.options.customParams);
        Object.assign(loggedUrlOptions, this.options.customParams);
        this.logger.debug({
            tnx: 'OAUTH2',
            user: this.options.user,
            action: 'generate'
        }, 'Requesting token using: %s', JSON.stringify(loggedUrlOptions));
        this.postRequest(this.options.accessUrl, urlOptions, this.options, (error, body) => {
            let data;
            if (error) {
                return callback(error);
            }
            try {
                data = JSON.parse(body.toString());
            }
            catch (E) {
                return callback(E);
            }
            if (!data || typeof data !== 'object') {
                this.logger.debug({
                    tnx: 'OAUTH2',
                    user: this.options.user,
                    action: 'post'
                }, 'Response: %s', (body || '').toString());
                const err = new Error('Invalid authentication response');
                err.code = errors.EOAUTH2;
                return callback(err);
            }
            const logData = Object.assign({}, data);
            if (logData.access_token) {
                logData.access_token = (logData.access_token || '').toString().substr(0, 6) + '...';
            }
            this.logger.debug({
                tnx: 'OAUTH2',
                user: this.options.user,
                action: 'post'
            }, 'Response: %s', JSON.stringify(logData));
            if (data.error) {
                // Error Response : https://tools.ietf.org/html/rfc6749#section-5.2
                let errorMessage = data.error;
                if (data.error_description) {
                    errorMessage += ': ' + data.error_description;
                }
                if (data.error_uri) {
                    errorMessage += ' (' + data.error_uri + ')';
                }
                const err = new Error(errorMessage);
                err.code = errors.EOAUTH2;
                return callback(err);
            }
            if (data.access_token) {
                this.updateToken(data.access_token, data.expires_in);
                return callback(null, this.accessToken);
            }
            const err = new Error('No access token');
            err.code = errors.EOAUTH2;
            return callback(err);
        });
    }
    /**
     * Converts an access_token and user id into a base64 encoded XOAuth2 token
     *
     * @param [accessToken] Access token string
     * @return Base64 encoded token for IMAP or SMTP login
     */
    buildXOAuth2Token(accessToken) {
        const authData = ['user=' + (this.options.user || ''), 'auth=Bearer ' + (accessToken || this.accessToken), '', ''];
        return Buffer.from(authData.join('\x01'), 'utf-8').toString('base64');
    }
    /**
     * Custom POST request handler.
     * This is only needed to keep paths short in Windows, usually this module
     * is a dependency of a dependency and if it tries to require something
     * like the request module the paths get way too long to handle for Windows.
     * As we do only a simple POST request we do not actually require complicated
     * logic support (no redirects, no nothing) anyway.
     *
     * @param url Url to POST to
     * @param payload Payload to POST
     * @param params Client options, the customHeaders and tls values are used for the request
     * @param callback Callback function with (err, buff)
     */
    postRequest(url, payload, params, callback) {
        let returned = false;
        const chunks = [];
        let chunklen = 0;
        const fetchOptions = {
            method: 'post',
            headers: params.customHeaders,
            body: payload,
            allowErrorResponse: true
        };
        // OAuth2 token endpoints are credential-bearing. src/fetch already
        // validates certs by default; pin rejectUnauthorized:true here so the
        // token fetch stays strict, while still layering params.tls (the
        // user's options.tls) on top so callers with a self-hosted provider on
        // a private CA can override.
        if (/^https:/i.test(url)) {
            fetchOptions.tls = Object.assign({ rejectUnauthorized: true }, params.tls || {});
        }
        const req = (0, index_js_1.default)(url, fetchOptions);
        req.on('readable', () => {
            let chunk;
            while ((chunk = req.read()) !== null) {
                chunks.push(chunk);
                chunklen += chunk.length;
            }
        });
        req.once('error', err => {
            if (returned) {
                return;
            }
            returned = true;
            return callback(err);
        });
        req.once('end', () => {
            if (returned) {
                return;
            }
            returned = true;
            return callback(null, Buffer.concat(chunks, chunklen));
        });
    }
    /**
     * Encodes a buffer or a string into Base64url format
     *
     * @param data The data to convert
     * @return The encoded string
     */
    toBase64URL(data) {
        if (typeof data === 'string') {
            data = Buffer.from(data);
        }
        return data
            .toString('base64')
            .replace(/[=]+/g, '') // remove '='s
            .replace(/\+/g, '-') // '+' → '-'
            .replace(/\//g, '_'); // '/' → '_'
    }
    /**
     * Creates a JSON Web Token signed with RS256 (SHA256 + RSA)
     *
     * @param payload The payload to include in the generated token
     * @return The generated and signed token
     */
    jwtSignRS256(payload) {
        const signedPayload = ['{"alg":"RS256","typ":"JWT"}', JSON.stringify(payload)].map(val => this.toBase64URL(val)).join('.');
        const signature = node_crypto_1.default
            .createSign('RSA-SHA256')
            .update(signedPayload)
            .sign(this.options.privateKey);
        return signedPayload + '.' + this.toBase64URL(signature);
    }
}
exports["default"] = XOAuth2;
module.exports = exports.default;
Object.defineProperty(module.exports, "default", ({ value: exports.default, enumerable: false, writable: true, configurable: true }));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/asset-relocator-loader */
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(9407);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;