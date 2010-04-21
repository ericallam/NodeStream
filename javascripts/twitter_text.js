var TwitterText = (function () { 
    var my = {};
    var unicode_spaces = [9, 10, 11, 12, 13, 32, 133, 160, 5760, 6158, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8202, 8232, 8233, 8239, 8287, 12288];
    var regexes = {};
    regexes['spaces'] = /\s/;
    regexes['at_signs'] = /[@＠]/;
    regexes['extract_mentions'] = new RegExp("(^|[^a-zA-Z0-9_])" + regexes['at_signs'] + "([a-zA-Z0-9_]{1,20})(?=(.|$))", "o");
    regexes['extract_reply'] = new RegExp("^(?:" + regexes['spaces'] + ")*" + regexes['at_signs'] + "([a-zA-Z0-9_]{1,20})", "o");
    regexes['list_name'] = /^[a-zA-Z\x80-\xff].{0,79}$/;
    var latin_accents = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþ\303\277";
    regexes['latin_accents'] = new RegExp("["+latin_accents+"]+", "o");
    var hashtag_charactars = "[a-z0-9_"+latin_accents+"]";
    regexes['auto_link_hashtags'] = new RegExp("(^|[^0-9A-Z&\/]+)(#|＃)([0-9A-Z_]*[A-Z_]+" + hashtag_charactars + "*)", "io");
    regexes['auto_link_usernames_or_lists'] = /([^a-zA-Z0-9_]|^)([@＠]+)([a-zA-Z0-9_]{1,20})(\/[a-zA-Z][a-zA-Z0-9\x80-\xff\-]{0,79})?/;
    regexes['auto_link_emoticon'] = /(8\-\#|8\-E|\+\-\(|\`\@|\`O|\&lt;\|:~\(|\}:o\{|:\-\[|\&gt;o\&lt;|X\-\/|\[:-\]\-I\-|\/\/\/\/Ö\\\\\\\\|\(\|:\|\/\)|∑:\*\)|\( \| \))/;
    
    var valid_preceding_chars = /(?:[^\/"':!=]|^|\:)/;
    var valid_domain = /(?:[^\s][\.-][^\s]|[^[:punct:]\s]){1,}\.[a-z]{2,}(?::[0-9]+)?/;
    var valid_url_path_chars = /[\.\,]?[a-z0-9!\*'\(\);:=\+\$\/%#\[\]\-_,~@]/;
    var valid_url_path_ending_chars = /[a-z0-9\)=#\/]/;
    var valid_url_query_chars = /[a-z0-9!\*'\(\);:&=\+\$\/%#\[\]\-_\.,~]/;
    var valid_url_query_ending_chars = /[a-z0-9_&=#]/;
    
    regexes['valid_url'] = new RegExp("((" + valid_preceding_chars + ")((https?:\/\/|www\.)(" + valid_domain + ")(/" + valid_url_path_chars + "*" + valid_url_path_ending_chars + "?)?(\\?" + valid_url_query_chars + "*" + valid_url_query_ending_chars + ")?))", "iox");
    
    regexes['valid_preceding_chars'] = valid_preceding_chars;
    regexes['valid_domain'] = valid_domain;
    regexes['valid_url_path_chars'] = valid_url_path_chars;
    regexes['valid_url_path_ending_chars'] = valid_url_path_ending_chars;
    regexes['valid_url_query_chars'] = valid_url_query_chars;
    regexes['valid_url_query_ending_chars'] = valid_url_query_ending_chars;
    
    //  
    // function privateMethod() { 
    //     // ... 
    // } 
     
    // my.moduleProperty = 1; 
    my.printUnicodeSpaces = function () { 
      console.log(this.unicode_spaces);
    }; 
    
    my.regexes = regexes;
     
    return my; 
}());


// module Twitter
//   # A collection of regular expressions for parsing Tweet text. The regular expression
//   # list is frozen at load time to ensure immutability. These reular expressions are
//   # used throughout the <tt>Twitter</tt> classes. Special care has been taken to make
//   # sure these reular expressions work with Tweets in all languages.
//   class Regex
//     REGEXEN = {} # :nodoc:
// 
//     # Space is more than %20, U+3000 for example is the full-width space used with Kanji. Provide a short-hand
//     # to access both the list of characters and a pattern suitible for use with String#split
//     #  Taken from: ActiveSupport::Multibyte::Handlers::UTF8Handler::UNICODE_WHITESPACE
//     UNICODE_SPACES = [
//           (0x0009..0x000D).to_a,  # White_Space # Cc   [5] <control-0009>..<control-000D>
//           0x0020,          # White_Space # Zs       SPACE
//           0x0085,          # White_Space # Cc       <control-0085>
//           0x00A0,          # White_Space # Zs       NO-BREAK SPACE
//           0x1680,          # White_Space # Zs       OGHAM SPACE MARK
//           0x180E,          # White_Space # Zs       MONGOLIAN VOWEL SEPARATOR
//           (0x2000..0x200A).to_a, # White_Space # Zs  [11] EN QUAD..HAIR SPACE
//           0x2028,          # White_Space # Zl       LINE SEPARATOR
//           0x2029,          # White_Space # Zp       PARAGRAPH SEPARATOR
//           0x202F,          # White_Space # Zs       NARROW NO-BREAK SPACE
//           0x205F,          # White_Space # Zs       MEDIUM MATHEMATICAL SPACE
//           0x3000,          # White_Space # Zs       IDEOGRAPHIC SPACE
//         ].flatten.freeze
//     REGEXEN[:spaces] = Regexp.new(UNICODE_SPACES.collect{ |e| [e].pack 'U*' }.join('|'))
// 
//     REGEXEN[:at_signs] = /[@＠]/
//     REGEXEN[:extract_mentions] = /(^|[^a-zA-Z0-9_])#{REGEXEN[:at_signs]}([a-zA-Z0-9_]{1,20})(?=(.|$))/o
//     REGEXEN[:extract_reply] = /^(?:#{REGEXEN[:spaces]})*#{REGEXEN[:at_signs]}([a-zA-Z0-9_]{1,20})/o
// 
//     REGEXEN[:list_name] = /^[a-zA-Z\x80-\xff].{0,79}$/
// 
//     # Latin accented characters (subtracted 0xD7 from the range, it's a confusable multiplication sign. Looks like "x")
//     LATIN_ACCENTS = [(0xc0..0xd6).to_a, (0xd8..0xf6).to_a, (0xf8..0xff).to_a].flatten.pack('U*').freeze
//     REGEXEN[:latin_accents] = /[#{LATIN_ACCENTS}]+/o
// 
//     # Characters considered valid in a hashtag but not at the beginning, where only a-z and 0-9 are valid.
//     HASHTAG_CHARACTERS = /[a-z0-9_#{LATIN_ACCENTS}]/io
//     REGEXEN[:auto_link_hashtags] = /(^|[^0-9A-Z&\/]+)(#|＃)([0-9A-Z_]*[A-Z_]+#{HASHTAG_CHARACTERS}*)/io
//     REGEXEN[:auto_link_usernames_or_lists] = /([^a-zA-Z0-9_]|^)([@＠]+)([a-zA-Z0-9_]{1,20})(\/[a-zA-Z][a-zA-Z0-9\x80-\xff\-]{0,79})?/
//     REGEXEN[:auto_link_emoticon] = /(8\-\#|8\-E|\+\-\(|\`\@|\`O|\&lt;\|:~\(|\}:o\{|:\-\[|\&gt;o\&lt;|X\-\/|\[:-\]\-I\-|\/\/\/\/Ö\\\\\\\\|\(\|:\|\/\)|∑:\*\)|\( \| \))/
// 
//     # URL related hash regex collection
//     REGEXEN[:valid_preceding_chars] = /(?:[^\/"':!=]|^|\:)/
//     REGEXEN[:valid_domain] = /(?:[^\s][\.-][^\s]|[^[:punct:]\s]){1,}\.[a-z]{2,}(?::[0-9]+)?/i
//     REGEXEN[:valid_url_path_chars] = /[\.\,]?[a-z0-9!\*'\(\);:=\+\$\/%#\[\]\-_,~@]/i
//     # Valid end-of-path chracters (so /foo. does not gobble the period).
//     #   1. Allow ) for Wikipedia URLs.
//     #   2. Allow =&# for empty URL parameters and other URL-join artifacts
//     REGEXEN[:valid_url_path_ending_chars] = /[a-z0-9\)=#\/]/i
//     REGEXEN[:valid_url_query_chars] = /[a-z0-9!\*'\(\);:&=\+\$\/%#\[\]\-_\.,~]/i
//     REGEXEN[:valid_url_query_ending_chars] = /[a-z0-9_&=#]/i
//     REGEXEN[:valid_url] = %r{
//       (                                                                                     #   $1 total match
//         (#{REGEXEN[:valid_preceding_chars]})                                                #   $2 Preceeding chracter
//         (                                                                                   #   $3 URL
//           (https?:\/\/|www\.)                                                               #   $4 Protocol or beginning
//           (#{REGEXEN[:valid_domain]})                                                       #   $5 Domain(s) and optional post number
//           (/#{REGEXEN[:valid_url_path_chars]}*#{REGEXEN[:valid_url_path_ending_chars]}?)?   #   $6 URL Path
//           (\?#{REGEXEN[:valid_url_query_chars]}*#{REGEXEN[:valid_url_query_ending_chars]})? #   $7 Query String
//         )
//       )
//     }iox;
// 
//     REGEXEN.each_pair{|k,v| v.freeze }
// 
//     # Return the regular expression for a given <tt>key</tt>. If the <tt>key</tt>
//     # is not a known symbol a <tt>nil</tt> will be returned.
//     def self.[](key)
//       REGEXEN[key]
//     end
//   end
// end
