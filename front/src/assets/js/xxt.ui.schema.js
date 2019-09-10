export default {
    txtSubstitute(oTxtData) {
        return oTxtData.replace(/\n/g, '<br>');
    },
    urlSubstitute(oUrlData) {
        let text;
        text = '';
        if (oUrlData) {
            if (oUrlData.title) {
                text += '【' + oUrlData.title + '】';
            }
            if (oUrlData.description) {
                text += oUrlData.description;
            }
        }
        text += '<a href="' + oUrlData.url + '">网页链接</a>';

        return text;
    }
}