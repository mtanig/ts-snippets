export class HostnameResolver {
    static resolve(hostname: string): Array<string> {
        let hostsTxt        = hostname;
        let hostsTxtEscaped = '';
        let shouldEscape    = false;
        // evict "," in "[XX-XX,XX]" to "/"
        try {
            for (let i = 0; i < hostsTxt.length; i += 1) {
                const character = hostsTxt[i];
                if (character === '[') {
                    shouldEscape = true;
                } else if (character === ']') {
                    shouldEscape = false;
                }
                if ((character === ',') && shouldEscape) {
                    hostsTxtEscaped += '/';
                } else {
                    hostsTxtEscaped += character;
                }
            }
            hostsTxt = hostsTxtEscaped;
            hostsTxtEscaped = '';
            // evict "," in {XX,XX} to "|"
            for (let i = 0; i < hostsTxt.length; i += 1) {
                const character = hostsTxt[i];
                if (character === '{') {
                    shouldEscape = true;
                } else if (character === '}') {
                    shouldEscape = false;
                }
                if ((character === ',') && shouldEscape) {
                    hostsTxtEscaped += '|';
                } else {
                    hostsTxtEscaped += character;
                }
            }
            hostsTxt = hostsTxtEscaped;
            hostsTxtEscaped = '';
            // divide by "," outside "{}" and "[]"
            let hostsInProgress = hostsTxt.split(',');
            let hosts           = [];
            // about "{xxx|xxx}"
            for (const host of hostsInProgress) {
                const results = host.match(/^(.*)\{(.+?)\}(.*)$/);
                if (results) {
                    const hostHead  = results[1];
                    const hostIndex = results[2];
                    const hostTail  = results[3];
                    // divide contents of "{xxx|xxx}"
                    for (const index of hostIndex.split('|')) {
                        hostsInProgress.push(`${hostHead}${index}${hostTail}`);
                    }
                } else {
                    hosts.push(host);
                }
            }
            hostsInProgress = hosts;
            hosts = [];
            // about "[XX-XX/XX]"
            for (const host of hostsInProgress) {
                const results = host.match(/^(.*)\[(.+?)\](.*)$/);
                if (results) {
                    const hostHead  = results[1];
                    const hostIndex = results[2];
                    const hostTail  = results[3];
                    // divide contents of "[XX-XX/XX]"
                    for (const index of hostIndex.split('/')) {
                        const indexResults = index.match(/^([0-9]+)-([0-9]+)$/);
                        if (indexResults) {
                            // about "XX-XX"
                            const hostIndexHead     = indexResults[1];
                            const hostIndexTail     = indexResults[2];
                            const hostIndexHeadNum  = Number(hostIndexHead.replace(/^0+/, ''));
                            const hostIndexTailNum  = Number(hostIndexTail.replace(/^0+/, ''));
                            if (hostIndexHeadNum < hostIndexTailNum) {
                                for (let i = hostIndexHeadNum; i <= hostIndexTailNum; i += 1) {
                                    // embed "0" when 00X (int(00X) => X)
                                    const lenGap = hostIndexHead.length - i.toString().length;
                                    hostsInProgress.push(`${hostHead}${'0'.repeat(lenGap)}${Number(i)}${hostTail}`);
                                }
                            }
                        } else if (index.match(/^[0-9]+$/)) {
                            // about "XX"
                            hostsInProgress.push(`${hostHead}${index}${hostTail}`);
                        }
                    }
                } else {
                    hosts.push(host);
                }
            }
            hosts = hosts.filter((elem, index, array)=>{ return array.includes(elem); }).sort();
            return hosts;
        } catch (error) {
            throw error;
        }
    }
}
export default HostnameResolver;