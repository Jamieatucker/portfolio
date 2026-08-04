/*
 * contact.js — copy-to-clipboard for the email address.
 * The button ships hidden and is only revealed when a clipboard path exists,
 * so no-JS and older browsers just see the mailto link.
 */
(function () {
    'use strict';

    var button = document.querySelector('[data-copy-email]');
    var status = document.querySelector('[data-copy-status]');
    if (!button) return;

    var email = button.getAttribute('data-email') || '';
    var hasAsyncClipboard = !!(navigator.clipboard && navigator.clipboard.writeText);
    var hasLegacyCopy = typeof document.execCommand === 'function';
    if (!email || (!hasAsyncClipboard && !hasLegacyCopy)) return;

    function announce(message) {
        if (status) status.textContent = message;
    }

    /** Pre-Clipboard-API fallback: copy from an off-screen textarea. */
    function legacyCopy(text) {
        var field = document.createElement('textarea');
        field.value = text;
        field.setAttribute('readonly', 'readonly');
        field.style.position = 'absolute';
        field.style.left = '-9999px';
        document.body.appendChild(field);
        field.select();
        var copied = false;
        try {
            copied = document.execCommand('copy');
        } catch (err) {
            copied = false;
        }
        document.body.removeChild(field);
        return copied;
    }

    button.hidden = false;

    button.addEventListener('click', function () {
        if (hasAsyncClipboard) {
            navigator.clipboard.writeText(email).then(
                function () {
                    announce('Copied ' + email + ' to your clipboard.');
                },
                function () {
                    announce(
                        legacyCopy(email)
                            ? 'Copied ' + email + ' to your clipboard.'
                            : 'Copy failed \u2014 the address is ' + email
                    );
                }
            );
            return;
        }

        announce(
            legacyCopy(email)
                ? 'Copied ' + email + ' to your clipboard.'
                : 'Copy failed \u2014 the address is ' + email
        );
    });
})();
