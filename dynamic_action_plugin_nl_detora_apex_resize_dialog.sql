set define off verify off feedback off
whenever sqlerror exit sql.sqlcode rollback
--------------------------------------------------------------------------------
--
-- ORACLE Application Express (APEX) export file
--
-- You should run the script connected to SQL*Plus as the Oracle user
-- APEX_050000 or as the owner (parsing schema) of the application.
--
-- NOTE: Calls to apex_application_install override the defaults below.
--
--------------------------------------------------------------------------------
begin
wwv_flow_api.import_begin (
 p_version_yyyy_mm_dd=>'2013.01.01'
,p_release=>'5.0.3.00.03'
,p_default_workspace_id=>5853461301138549
,p_default_application_id=>1400
,p_default_owner=>'G2S_O'
);
end;
/
prompt --application/ui_types
begin
null;
end;
/
prompt --application/shared_components/plugins/dynamic_action/nl_detora_apex_resize_dialog
begin
wwv_flow_api.create_plugin(
 p_id=>wwv_flow_api.id(30438938711500818)
,p_plugin_type=>'DYNAMIC ACTION'
,p_name=>'NL.DETORA.APEX.RESIZE_DIALOG'
,p_display_name=>'Resize Dialog'
,p_category=>'INIT'
,p_supported_ui_types=>'DESKTOP'
,p_javascript_file_urls=>'#PLUGIN_FILES#apexresizedialog.js'
,p_plsql_code=>wwv_flow_utilities.join(wwv_flow_t_varchar2(
'/*-------------------------------------',
' * APEX Resize Dialog',
' * Version: 1.0 (05-01-2016)',
' * Author:  Dick Dral',
' *-------------------------------------',
'*/',
'FUNCTION render_resize_dialog(p_dynamic_action IN apex_plugin.t_dynamic_action,',
'                               p_plugin         IN apex_plugin.t_plugin)',
'  RETURN apex_plugin.t_dynamic_action_render_result IS',
'  --',
'  -- plugin attributes',
'  l_result          apex_plugin.t_dynamic_action_render_result;',
'  l_center_dialog   varchar2(100)  := p_dynamic_action.attribute_01;',
'  l_margin          number         := p_dynamic_action.attribute_02;',
'  --',
'BEGIN',
'  -- attribute defaults',
'  l_center_dialog   := nvl(l_center_dialog',
'                          ,''false'');',
'  l_margin          := nvl(l_margin',
'                          , 20);',
'  --',
'  l_result.javascript_function := ''apexresizedialog.doIt'';',
'  l_result.attribute_01        := l_center_dialog;',
'  l_result.attribute_02        := l_margin;',
'  --',
'  RETURN l_result;',
'  --',
'END render_resize_dialog;'))
,p_render_function=>'render_resize_dialog'
,p_standard_attributes=>'ONLOAD'
,p_substitute_attributes=>true
,p_subscribe_plugin_settings=>true
,p_version_identifier=>'1.0'
,p_files_version=>2
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(30598436091798541)
,p_plugin_id=>wwv_flow_api.id(30438938711500818)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>1
,p_display_sequence=>10
,p_prompt=>'Center Dialog?'
,p_attribute_type=>'SELECT LIST'
,p_is_required=>false
,p_is_translatable=>false
,p_lov_type=>'STATIC'
);
wwv_flow_api.create_plugin_attr_value(
 p_id=>wwv_flow_api.id(30599522124800648)
,p_plugin_attribute_id=>wwv_flow_api.id(30598436091798541)
,p_display_sequence=>10
,p_display_value=>'No'
,p_return_value=>'false'
,p_is_quick_pick=>true
);
wwv_flow_api.create_plugin_attr_value(
 p_id=>wwv_flow_api.id(30599955129801824)
,p_plugin_attribute_id=>wwv_flow_api.id(30598436091798541)
,p_display_sequence=>20
,p_display_value=>'Yes'
,p_return_value=>'true'
,p_is_quick_pick=>true
);
wwv_flow_api.create_plugin_attribute(
 p_id=>wwv_flow_api.id(30576045085549719)
,p_plugin_id=>wwv_flow_api.id(30438938711500818)
,p_attribute_scope=>'COMPONENT'
,p_attribute_sequence=>2
,p_display_sequence=>20
,p_prompt=>'Margin'
,p_attribute_type=>'NUMBER'
,p_is_required=>false
,p_default_value=>'20'
,p_unit=>'px'
,p_supported_ui_types=>'DESKTOP'
,p_is_translatable=>false
,p_help_text=>'(Outer) margin for dialog'
);
end;
/
begin
wwv_flow_api.g_varchar2_table := wwv_flow_api.empty_varchar2_table;
wwv_flow_api.g_varchar2_table(1) := '66756E6374696F6E20726573697A655F6469616C6F6728290A7B0A20207661722068656164657220203D202428272E742D4469616C6F672D68656164657227293B0A20207661722068656967687420203D207061727365496E7428242868656164657229';
wwv_flow_api.g_varchar2_table(2) := '2E6865696768742829293B20200A202020200A202076617220626F6479202020203D202428272E742D4469616C6F672D626F647927293B0A20207661722070616464696E67203D207061727365496E74282428626F6479292E637373282770616464696E';
wwv_flow_api.g_varchar2_table(3) := '672D746F70272929202B207061727365496E74282428626F6479292E637373282770616464696E672D626F74746F6D2729293B0A2020686569676874202B3D2070616464696E673B0A202020200A202076617220636F6E7461696E6572203D202428626F';
wwv_flow_api.g_varchar2_table(4) := '6479292E66696E6428272E636F6E7461696E657227292E666972737428293B0A20206865696768742020202B3D207061727365496E74282428636F6E7461696E6572292E6865696768742829293B20200A202020200A202076617220666F6F7465722020';
wwv_flow_api.g_varchar2_table(5) := '20203D202428272E742D4469616C6F672D666F6F74657227293B0A20206865696768742020202B3D207061727365496E74282428666F6F746572292E6865696768742829293B20200A0A2020706172656E745F636F6E7461696E6572203D2077696E646F';
wwv_flow_api.g_varchar2_table(6) := '772E706172656E742E2428272E75692D6469616C6F672D636F6E74656E7427293B0A20202428706172656E745F636F6E7461696E6572292E68656967687428686569676874293B0A7D';
null;
end;
/
begin
wwv_flow_api.create_plugin_file(
 p_id=>wwv_flow_api.id(30439254800509285)
,p_plugin_id=>wwv_flow_api.id(30438938711500818)
,p_file_name=>'apexresizedialog.js'
,p_mime_type=>'application/javascript'
,p_file_charset=>'utf-8'
,p_file_content=>wwv_flow_api.varchar2_to_blob(wwv_flow_api.g_varchar2_table)
);
end;
/
begin
wwv_flow_api.import_end(p_auto_install_sup_obj => nvl(wwv_flow_application_install.get_auto_install_sup_obj, false), p_is_component_import => true);
commit;
end;
/
set verify on feedback on define on
prompt  ...done
