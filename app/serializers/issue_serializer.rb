# frozen_string_literal: true

class IssueSerializer < BaseSerializer
  # This overrided method takes care of which entity should be used
  # to serialize the `issue` based on `basic` key in `opts` param.
  # Hence, `entity` doesn't need to be declared on the class scope.
  def represent(issue, opts = {})
    entity =
      case opts[:serializer]
      when 'sidebar'
        IssueSidebarEntity
      when 'board'
        IssueBoardEntity
      else
        IssueEntity
      end

    super(issue, opts, entity)
  end
end
