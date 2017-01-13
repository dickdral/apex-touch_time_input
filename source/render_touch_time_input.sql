/*-------------------------------------
 * APEX Touch Time Input
 * Version: 1.0 (11-01-2016)
 * Author:  Dick Dral
 *-------------------------------------
*/
function render_touch_time_input
                ( p_dynamic_action in apex_plugin.t_dynamic_action
                , p_plugin           in  apex_plugin.t_plugin
                ) return apex_plugin.t_dynamic_action_render_result is
  --
  -- plugin attributes
  l_result       apex_plugin.t_dynamic_action_render_result;
  l_window_base  number        := p_dynamic_action.attribute_01;
  l_time_format  varchar2(100) := p_plugin.attribute_01;
  l_debug        number        := 0;
  -- js/css file vars
  l_apextic_js   varchar2(50);
  --
begin
  -- attribute defaults
  l_window_base := nvl(l_window_base,
                          7);
  l_time_format := nvl(l_time_format,
                          'hh24:mi');
  --
  if apex_application.g_debug then
    apex_plugin_util.debug_dynamic_action(p_plugin         => p_plugin,
                                          p_dynamic_action => p_dynamic_action);
    l_debug := 1;                                      
    -- set js/css filenames (normal version)
    l_apextic_js  := 'apextic';
    --
  else
    -- minified version
    l_apextic_js  := 'apextic.min';
    --
  end if;
  --
  apex_javascript.add_library(p_name           => l_apextic_js,
                              p_directory      => p_plugin.file_prefix ,
                              p_version        => NULL,
                              p_skip_extension => FALSE);

  --
  l_result.javascript_function := 'apextic.doIt';
  l_result.attribute_01        := l_window_base;
  l_result.attribute_02        := l_time_format;
  l_result.attribute_10        := l_debug;
  --
  return l_result;
  --
end render_touch_time_input;