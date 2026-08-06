-- DB1 A6 Gate D. This test-only unit is deliberately outside the 117 retained
-- Scottish Parliament responses and never makes a network request.
SET ROLE cld_gb_sct_db1_owner;

INSERT INTO db1.source_form (form_key, source_route_form, access_treatment, description, is_synthetic)
VALUES ('__a6_assurance_synthetic__', 'synthetic://db1-a6-assurance', 'RETAIN_WHOLE',
  'Synthetic backend-assurance proof only', true)
ON CONFLICT (form_key) DO NOTHING;

INSERT INTO db1.response_unit (response_unit_key, form_key, request_locator, unit_class, later_cadence, is_synthetic)
VALUES ('__a6_assurance_synthetic__.drift', '__a6_assurance_synthetic__',
  'synthetic://db1-a6-assurance/drift', 'SYNTHETIC', 'SYNTHETIC_ONLY', true)
ON CONFLICT (response_unit_key) DO NOTHING;

RESET ROLE;
