require "nokogiri"
require "watir"

BRANDS = [
  'rolex',
  'audemarspiguet',
  'breitling',
  'iwc',
  'jaegerlecoultre',
  'omega',
  'panerai',
  'patekphilippe',
  'cartier',
  'gucci',
  'seiko',
  'movado',
  'zenith'
]

browser = Watir::Browser.new(:chrome)

BRANDS.each do |brand|
  urls = [
    "http://chrono24.com/#{brand}/index.htm",
    "http://chrono24.com/#{brand}/index-2.htm",
    "http://chrono24.com/#{brand}/index-3.htm",
    "http://chrono24.com/#{brand}/index-4.htm",
    "http://chrono24.com/#{brand}/index-5.htm"
  ]

  urls.each do |url|
    browser.goto(url)
    sleep 2
    15.times do |i|
      browser.execute_script("window.scrollBy(0,500)")
      sleep 2
    end

    doc = Nokogiri::HTML.parse(browser.html)

    article_divs = doc.css(".article-item-container")
    article_divs.each do |article_div|
      image_div = article_div.at_css(".article-image-container .content img")
      next if !article_div.at_css(".article-price strong")
      price_text = article_div.at_css(".article-price strong").text
      next if !image_div || !price_text

      image_url = image_div['src']
      price = price_text.gsub(/[^0-9]/, "")

      next if image_url.empty? || price.empty?

      File.open("data/#{brand}.txt", "a+") do |f|
        f.puts("#{image_url},#{price}")
      end
    end

  end

end
