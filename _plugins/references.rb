# references.rb: jekyll markdown references plugin
#
# add this file to your _plugins directory (create it if needed)
# create a file (exactly) named _references.md in your Jekyll site root,
# then add your markdown reference-style link definitions to it.
# for example:
#   [jsshaper]: http://jsshaper.org  "an extensible framework for JavaScript syntax tree shaping"
#
# you can now reference these links in any markdown file
# for example:
#   You should [check out JSShaper][jsshaper]
# 
# 2012-05-12 Update by [mytharcher](http://github.com/mytharcher)
# - Move the module to the place under "MarkdownConverter".
# - Overwrite the "convert" method to insert a preprocess hook to append references content.
# - Add prefix and suffix new line to make sure that the references should be a separated markdown block.

module Jekyll

  class MarkdownConverter

    alias old_convert convert

    @@refs_content = nil

    def get_references()
      # read and cache content of _references.md
      if @@refs_content.nil?
        refs_path = File.join(Jekyll::DEFAULTS['source'], "_references.md")
        @@refs_content = if File.exist?(refs_path) then File.read(refs_path) 
                         else "" end
      end
      @@refs_content
    end

    def convert(content)
      # To make sure that the references should be a separated markdown block.
      old_convert(content + "\n\n" + get_references + "\n\n")
    end
  end
end
