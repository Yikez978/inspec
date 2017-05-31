# encoding: utf-8
# author: Dominik Richter
# author: Christoph Hartmann

require 'utils/nginx_parser'

module Inspec::Resources
  class NginxConf < Inspec.resource(1)
    name 'nginx_conf'
    desc 'Use the nginx_conf InSpec resource to test configuration data '\
         'for the NginX web server located in /etc/nginx/nginx.conf on '\
         'Linux and UNIX platforms.'
    example "
      describe nginx_conf.params ...
      describe nginx_conf('/path/to/my/nginx.conf').params ...
    "

    attr_reader :contents

    def initialize(conf_path = nil)
      @conf_path = conf_path || '/etc/nginx/nginx.conf'
      @contents = {}
    end

    def params
      @params ||= parse_nginx(@conf_path)
    end

    def to_s
      "nginx_conf #{@conf_path}"
    end

    private

    def read_content(path)
      return @contents[path] if @contents.key?(path)
      file = inspec.file(path)
      if !file.file?
        return skip_resource "Can't find file \"#{path}\""
      end
      @contents[path] = file.content
    end

    def parse_nginx(path)
      content = read_content(path)
      data = NginxConfig.parse(content)
      resolve_references(data, File.dirname(path))
    rescue StandardError => e
      raise "Cannot parse NginX config in #{path}: #{e}"
    end

    def resolve_references(data, rel_path)
      return data.map { |x| resolve_references(x, rel_path) } if data.is_a?(Array)
      return data unless data.is_a?(Hash)
      if data.key?('include')
        data.delete('include').flatten
            .map { |x| File.expand_path(x, rel_path) }
            .map { |path| parse_nginx(path) }
            .map { |e| data.merge!(e) }
      end
      Hash[data.map { |k, v| [k, resolve_references(v, rel_path)] }]
    end
  end
end
