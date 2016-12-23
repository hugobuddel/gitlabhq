require 'spec_helper'

describe 'layouts/_head' do
  it 'escapes HTML-safe strings in page_title' do
    stub_helper_with_safe_string(:page_title)

    render

    expect(rendered).to match(%{content="foo&quot; http-equiv=&quot;refresh"})
  end

  it 'escapes HTML-safe strings in page_description' do
    stub_helper_with_safe_string(:page_description)

    render

    expect(rendered).to match(%{content="foo&quot; http-equiv=&quot;refresh"})
  end

  it 'escapes HTML-safe strings in page_image' do
    stub_helper_with_safe_string(:page_image)

    render

    expect(rendered).to match(%{content="foo&quot; http-equiv=&quot;refresh"})
  end

  it 'includes an opensearch link' do
    render

    link = Nokogiri::XML(rendered).css('//link[rel=search]')
    aggregate_failures 'link attributes' do
      expect(link.attr('href').value).to eq('/opensearch.xml')
      expect(link.attr('title').value).to eq("#{Gitlab.config.gitlab.host} GitLab")
      expect(link.attr('type').value).to eq('application/opensearchdescription+xml')
    end
  end

  def stub_helper_with_safe_string(method)
    allow_any_instance_of(PageLayoutHelper).to receive(method)
      .and_return(%q{foo" http-equiv="refresh}.html_safe)
  end
end
