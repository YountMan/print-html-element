/*
* Print Element Vanilla 0.1
*
* Copyright (c) 2015 Philip Da Silva
*
* Forked from jQuery.printElement (https://github.com/erikzaadi/jQueryPlugins/tree/master/jQuery.printElement)
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*/

var PrintElement = function() {

    function printElement(element, opts) {
        opts = opts || {};
        opts = {
            printMode: opts.printMode || '',
            pageTitle: opts.pageTitle || ''
        };

        // Get markup to be printed
        var html = _getMarkup(element, opts),
            printWindow,
            printIframe,
            printDocument,
            printElementID;

        if (opts.printMode.toLowerCase() == 'popup')
        {
            printWindow = window.open('about:blank', 'printElementWindow');
            printDocument = printWindow.document;
        }
        else
        {
            printElementID = 'printElement_' + (Math.round(Math.random() * 99999)).toString();

            printIframe = document.createElement('iframe');
            printIframe.setAttribute('id', printElementID); //The random ID is to overcome a safari bug http://www.cjboco.com.sharedcopy.com/post.cfm/442dc92cd1c0ca10a5c35210b8166882.html
            printIframe.setAttribute('src', 'about:blank');
            printIframe.setAttribute('frameBorder', '0');
            printIframe.setAttribute('scrolling', 'no');
            printIframe.setAttribute('style', 'position:fixed;bottom:100%;right:100%;');

            document.body.appendChild(printIframe);

            printDocument = (printIframe.contentWindow || printIframe.contentDocument);
            if (printDocument.document)
            {
                printDocument = printDocument.document;
            }

            printIframe = document.frames ? document.frames[printElementID] : document.getElementById(printElementID);
            printWindow = printIframe.contentWindow || printIframe;
        }

        focus();
        printDocument.open();
        printDocument.write(html);
        printDocument.close();

        _callPrint(printWindow, printIframe);
    }

    function _callPrint(element, iframe) {
        if (element && element.printPage)
        {
            element.printPage();
            document.body.removeChild(iframe); // Remove iframe afrer printing
        }
        else
        {
            setTimeout(function() {
                _callPrint(element, iframe);
            }, 50);
        }
    }

    function _getBaseHref() {
        var port = (window.location.port) ? ':' + window.location.port : '';
        return window.location.protocol + '//' + window.location.hostname + port + window.location.pathname;
    }

    function _getMarkup(element, opts) {
        var elementHtml = element.innerHTML, // Does not support form input elements
            stylesheets,
            html = [];

        html.push('<html><head><title>' + (opts.pageTitle || '') + '</title>');

        stylesheets = Array.prototype.slice.call( document.getElementsByTagName('link') );
        stylesheets.forEach(function(link){
            html.push('<link rel="stylesheet" href="' + link.href + '">');
        });

        // Ensure that relative links work
        html.push('<base href="' + _getBaseHref() + '" />');
        html.push('</head><body class="print-elementbody">');
        html.push('<div class="' + element.className + '">' + elementHtml + '</div>');
        html.push('<script type="text/javascript">function printPage(){focus();print();' + ((opts.printMode.toLowerCase() == 'popup') ? 'close();' : '') + '}</script>');
        html.push('</body></html>');

        return html.join('');
    }

    return {
        print: printElement
    };
};

if (typeof module === 'object' && module.exports === exports)
{
    module.exports = PrintElement();
}