class SEOAnalyzer {
  constructor() {
    this.stopwordsFa = [
      "در",
      "به",
      "از",
      "که",
      "و",
      "با",
      "برای",
      "این",
      "آن",
      "است",
      "را",
      "تا",
      "هر",
      "یا",
      "بر",
      "او",
      "ما",
      "شما",
      "آنها",
      "من",
      "تو",
      "های",
      "شود",
      "می",
      "باشد",
      "یک",
      "هم",
      "کرد",
      "خود",
      "گفت",
      "شد",
      "دارد",
      "بود",
      "کند",
      "چه",
      "نیز",
      "بین",
      "پس",
      "اگر",
      "همه",
      "یکی",
      "چند",
      "روی",
      "بعد",
      "پیش",
      "نمی",
      "وی",
      "کس",
      "کجا",
      "کی",
      "چرا",
      "بله",
      "نه",
      "آری",
      "بسیار",
      "خیلی",
    ];

    this.stopwordsEn = [
      "the",
      "is",
      "at",
      "which",
      "on",
      "a",
      "an",
      "as",
      "are",
      "was",
      "were",
      "been",
      "be",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "should",
      "could",
      "may",
      "might",
      "must",
      "can",
      "of",
      "for",
      "to",
      "in",
      "and",
      "or",
      "but",
      "not",
      "this",
      "that",
      "with",
      "from",
      "by",
      "about",
      "into",
      "through",
      "during",
      "before",
      "after",
      "above",
      "below",
      "between",
      "under",
      "again",
      "further",
      "then",
      "once",
      "here",
      "there",
      "when",
      "where",
      "why",
      "how",
      "all",
      "both",
      "each",
      "few",
      "more",
      "most",
      "other",
      "some",
      "such",
      "only",
      "own",
      "same",
      "so",
      "than",
      "too",
      "very",
      "just",
    ];
  }

  detectLanguage(text) {
    const persianPattern = /[\u0600-\u06FF]/;
    const isPersian = persianPattern.test(text);
    return isPersian ? "fa" : "en";
  }

  analyze(text) {
    if (!text || text.trim().length === 0) {
      throw new Error("متن نمی‌تواند خالی باشد");
    }

    const language = this.detectLanguage(text);
    const stopwords = language === "fa" ? this.stopwordsFa : this.stopwordsEn;

    const words = text.split(/\s+/);
    const wordCount = words.length;
    const charCount = text.length;
    const uniqueWords = new Set(words.map((w) => w.toLowerCase())).size;

    const sentences = text.split(/[.!?؟]+/).filter((s) => s.trim().length > 0);
    const sentenceCount = sentences.length || 1;
    const avgWordsPerSentence = (wordCount / sentenceCount).toFixed(1);

    const cleanWords = words.map((w) =>
      w.replace(/[.,!?;:()[\]{}""'؛،]/g, "").toLowerCase()
    );

    const filteredWords = cleanWords.filter(
      (w) => w.length > 3 && !stopwords.includes(w)
    );

    const wordFreq = {};
    filteredWords.forEach((word) => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    const topKeywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const readability = this.calculateReadability(avgWordsPerSentence);

    const keywordDensities = this.calculateKeywordDensity(
      topKeywords,
      wordCount
    );

    const seoTitle = this.generateSEOTitle(topKeywords, text);

    const metaDescription = this.generateMetaDescription(text);

    const score = this.calculateSEOScore({
      wordCount,
      seoTitle,
      metaDescription,
      topKeywords,
      readability,
      sentenceCount,
    });

    const suggestions = this.generateSuggestions({
      score,
      wordCount,
      readability,
      keywordDensities,
      sentenceCount,
    });

    return {
      language: language === "fa" ? "فارسی" : "English",
      wordCount,
      charCount,
      uniqueWords,
      sentenceCount,
      avgWordsPerSentence: parseFloat(avgWordsPerSentence),
      keywords: topKeywords,
      keywordDensities,
      readability,
      seoTitle,
      metaDescription,
      score,
      suggestions,
      timestamp: new Date().toISOString(),
    };
  }

  calculateReadability(avgWordsPerSentence) {
    let level, className;

    if (avgWordsPerSentence <= 15) {
      level = "ساده";
      className = "readability-easy";
    } else if (avgWordsPerSentence <= 25) {
      level = "متوسط";
      className = "readability-medium";
    } else {
      level = "پیچیده";
      className = "readability-hard";
    }

    return { level, className };
  }

  calculateKeywordDensity(keywords, totalWords) {
    return keywords.map((kw) => {
      const density = ((kw[1] / totalWords) * 100).toFixed(2);
      let status = "مناسب";
      let color = "#2ecc71";

      if (density < 1) {
        status = "کم";
        color = "#f39c12";
      } else if (density > 3) {
        status = "زیاد";
        color = "#e74c3c";
      }

      return {
        word: kw[0],
        count: kw[1],
        density: parseFloat(density),
        status,
        color,
      };
    });
  }

  generateSEOTitle(keywords, text) {
    if (keywords.length === 0) {
      return text.substring(0, 60).trim() + "...";
    }

    const topWords = keywords.slice(0, 3).map((kw) => kw[0]);
    let title = topWords.join(" - ");

    if (title.length > 60) {
      title = title.substring(0, 57) + "...";
    } else if (title.length < 50) {
      const extraWords = text.split(/\s+/).slice(0, 10).join(" ");
      title = extraWords.substring(0, 57) + "...";
    }

    return title;
  }

  generateMetaDescription(text) {
    if (text.length <= 160) {
      return text;
    }

    const sentences = text.split(/[.!?؟]+/);
    let description = "";

    for (const sentence of sentences) {
      if ((description + sentence).length <= 157) {
        description += sentence + ". ";
      } else {
        break;
      }
    }

    if (description.length < 140) {
      description = text.substring(0, 157) + "...";
    } else {
      description = description.trim() + "...";
    }

    return description;
  }

  calculateSEOScore(data) {
    let score = 0;

    if (data.wordCount >= 300 && data.wordCount <= 2000) {
      score += 30;
    } else if (data.wordCount >= 200) {
      score += 20;
    } else if (data.wordCount >= 100) {
      score += 10;
    }

    const titleLength = data.seoTitle.length;
    if (titleLength >= 50 && titleLength <= 60) {
      score += 25;
    } else if (titleLength >= 40 && titleLength <= 70) {
      score += 15;
    } else if (titleLength >= 30) {
      score += 10;
    }

    const descLength = data.metaDescription.length;
    if (descLength >= 155 && descLength <= 160) {
      score += 25;
    } else if (descLength >= 140 && descLength <= 170) {
      score += 15;
    } else if (descLength >= 120) {
      score += 10;
    }

    if (data.topKeywords.length >= 5) {
      score += 20;
    } else if (data.topKeywords.length >= 3) {
      score += 15;
    } else if (data.topKeywords.length >= 1) {
      score += 10;
    }

    return Math.min(score, 100);
  }

  generateSuggestions(data) {
    const suggestions = [];

    if (data.wordCount < 300) {
      suggestions.push({
        type: "content-length",
        title: "📝 افزایش طول محتوا",
        text: `محتوای شما ${data.wordCount} کلمه دارد. برای SEO بهتر، حداقل 300 کلمه پیشنهاد می‌شود.`,
        priority: "high",
      });
    } else if (data.wordCount > 2500) {
      suggestions.push({
        type: "content-length",
        title: "✂️ کاهش طول محتوا",
        text: "محتوای شما بسیار طولانی است. سعی کنید مطالب را خلاصه‌تر و مفیدتر ارائه دهید.",
        priority: "medium",
      });
    }

    if (data.readability.level === "پیچیده") {
      suggestions.push({
        type: "readability",
        title: "📖 ساده‌سازی جملات",
        text: "جملات شما بلند و پیچیده هستند. استفاده از جملات کوتاه‌تر (10-15 کلمه) خوانایی را بهبود می‌بخشد.",
        priority: "high",
      });
    }

    const lowDensity = data.keywordDensities.filter((k) => k.density < 1);
    if (lowDensity.length > 0) {
      suggestions.push({
        type: "keyword-density",
        title: "🔑 افزایش تراکم کلمات کلیدی",
        text: `کلمات "${lowDensity
          .map((k) => k.word)
          .join(
            "، "
          )}" تراکم پایینی دارند. آن‌ها را بیشتر در متن استفاده کنید (1-3%).`,
        priority: "medium",
      });
    }

    const highDensity = data.keywordDensities.filter((k) => k.density > 3);
    if (highDensity.length > 0) {
      suggestions.push({
        type: "keyword-stuffing",
        title: "⚠️ کاهش تکرار کلمات",
        text: `کلمات "${highDensity
          .map((k) => k.word)
          .join(
            "، "
          )}" بیش از حد تکرار شده‌اند. این می‌تواند به SEO آسیب برساند.`,
        priority: "high",
      });
    }

    if (data.score < 50) {
      suggestions.push({
        type: "overall-seo",
        title: "⭐ بهبود کلی SEO",
        text: "با افزودن لینک‌های داخلی، تصاویر با alt text مناسب، و استفاده از هدینگ‌ها (H1, H2, H3) امتیاز SEO را بهبود دهید.",
        priority: "high",
      });
    }

    if (data.sentenceCount < 5) {
      suggestions.push({
        type: "structure",
        title: "📄 افزایش ساختار محتوا",
        text: "محتوای شما جملات کمی دارد. با افزودن پاراگراف‌های بیشتر، ساختار محتوا را بهبود دهید.",
        priority: "medium",
      });
    }

    return suggestions;
  }

  compare(text1, text2) {
    const analysis1 = this.analyze(text1);
    const analysis2 = this.analyze(text2);

    return {
      text1: analysis1,
      text2: analysis2,
      comparison: {
        wordCountDiff: analysis2.wordCount - analysis1.wordCount,
        charCountDiff: analysis2.charCount - analysis1.charCount,
        scoreDiff: analysis2.score - analysis1.score,
        readabilityComparison: this.compareReadability(
          analysis1.readability.level,
          analysis2.readability.level
        ),
      },
    };
  }

  compareReadability(level1, level2) {
    const levels = { ساده: 1, متوسط: 2, پیچیده: 3 };
    const diff = levels[level2] - levels[level1];

    if (diff > 0) return "متن دوم پیچیده‌تر است";
    if (diff < 0) return "متن دوم ساده‌تر است";
    return "هر دو متن خوانایی یکسانی دارند";
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = SEOAnalyzer;
}
