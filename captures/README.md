# Packet captures

In this directory is [a packet capture](./capture.pcap)
that can be loaded by programs such as [Wireshark](https://www.wireshark.org).

The [keylog](./keylog.txt)
(a [NSS key log](https://firefox-source-docs.mozilla.org/security/nss/legacy/key_log_format/))
for this packet capture can be loaded in Wireshark by right-clicking
a TLS packet and selecting `Protocol Preferences → Transport Layer Security -> Pre-Master-Secret log filename`.
This allows Wireshark to decrypt and show TLS connection details.
