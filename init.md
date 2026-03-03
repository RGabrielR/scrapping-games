Quiero que actúes como un **Senior Frontend Engineer / Frontend Architect (nivel staff)** especializado en **refactors grandes en aplicaciones frontend modernas**.

Tu objetivo es **reestructurar este proyecto completo** siguiendo buenas prácticas de desarrollo vigentes en **2026**, con foco en:

* **Screaming Architecture**: que la estructura del proyecto grite el dominio y los casos de uso, no el framework.
* **SOLID principles**
* **Separation of concerns**
* **Desacople fuerte entre UI, lógica de negocio, orquestación, acceso a datos y detalles de infraestructura**
* **Alta mantenibilidad, testabilidad, legibilidad y escalabilidad**
* **Testing por capas**, especialmente para la lógica de negocio
* **Mínimo acoplamiento al framework**
* **Código preparado para evolucionar sin romperse fácilmente**

## Objetivo general

Necesito que analices el proyecto actual y lo transformes en una arquitectura frontend limpia, robusta y profesional, manteniendo el comportamiento funcional existente en la medida de lo posible, pero reorganizando la base del código para que quede alineada con estándares de ingeniería senior.

No quiero un simple “acomodo de carpetas”.
Quiero una **reestructuración real**, bien razonada, con decisiones arquitectónicas explícitas.

---

## Enfoque arquitectónico esperado

### 1. Usar **Screaming Architecture**

La estructura debe reflejar principalmente el **negocio / dominio / features**, no carpetas genéricas tipo:

* `components/`
* `utils/`
* `hooks/`
* `services/`

Estas carpetas genéricas solo pueden existir si tienen una justificación muy clara y su alcance está bien definido.

La organización debe priorizar algo como:

* dominios
* features
* casos de uso
* entidades del negocio
* adaptadores
* contratos
* infraestructura
* shared transversal bien acotado

La arquitectura debe hacer evidente:

* qué problema resuelve cada módulo
* qué pertenece al dominio
* qué es presentación
* qué es integración
* qué es infraestructura
* qué es código reutilizable transversal

---

### 2. Aplicar principios **SOLID**

Quiero que el refactor aplique explícitamente:

* **S**ingle Responsibility Principle
  Cada módulo, archivo, componente, hook, servicio o clase debe tener una responsabilidad clara y acotada.

* **O**pen/Closed Principle
  La solución debe quedar preparada para extender comportamiento sin tener que modificar piezas críticas constantemente.

* **L**iskov Substitution Principle
  Si hay contratos, adapters o estrategias, deben ser consistentes.

* **I**nterface Segregation Principle
  Evitar contratos gigantes y APIs internas ambiguas.

* **D**ependency Inversion Principle
  La lógica de negocio no debe depender de detalles concretos de UI, librerías, fetchers o frameworks.

---

### 3. Desacoplar al máximo

Quiero que separes claramente:

* **UI / Presentación**
* **Application layer / Use cases**
* **Domain / business rules**
* **Infrastructure / API clients / storage / framework adapters**
* **State management** si existe
* **Validation**
* **Mappers / transformers**
* **Side effects**
* **Navigation / routing adapters**
* **Design system / reusable primitives**

La lógica de negocio **no** debe quedar enterrada dentro de:

* componentes visuales
* páginas
* hooks de UI
* handlers inline
* reducers gigantes
* helpers genéricos ambiguos

---

### 4. Testing por capas

Quiero una estrategia de testing seria y profesional.

#### Debes crear o dejar preparado:

* **Unit tests** para lógica pura y reglas de negocio
* **Tests de casos de uso / application services**
* **Tests de integración** para piezas importantes con adapters o gateways
* **Component tests** donde tenga sentido
* **Mocks / fakes / test doubles** bien organizados
* Base sólida para crecimiento futuro del testing

#### Prioridad:

1. Regla de negocio
2. Casos de uso
3. Mappers / transformaciones críticas
4. Integraciones relevantes
5. UI crítica

#### Requisito importante:

La lógica importante debe ser testeable **sin depender del framework visual**.

---

## Lo que espero que hagas

### Fase 1 — Auditoría del proyecto actual

Antes de modificar, inspecciona el proyecto y detecta:

* estructura actual
* puntos de acoplamiento excesivo
* lógica mezclada con presentación
* hooks sobrecargados
* componentes demasiado grandes
* duplicaciones
* dependencias innecesarias
* carpetas genéricas mal definidas
* problemas de naming
* problemas de boundaries
* problemas de testabilidad
* problemas de escalabilidad

Luego explícame brevemente:

1. **Qué problemas arquitectónicos encontraste**
2. **Qué estrategia de refactor vas a seguir**
3. **Qué estructura nueva propones**
4. **Qué trade-offs estás tomando**

---

### Fase 2 — Definir arquitectura target

Propón una arquitectura final consistente con el proyecto real.

Quiero que diseñes una estructura basada en algo del estilo:

* `src/app` o equivalente solo para bootstrap/composición/framework entrypoints
* `src/features/...`
* `src/domain/...`
* `src/application/...`
* `src/infrastructure/...`
* `src/shared/...`

Pero **no lo tomes como algo rígido**.
Adáptalo al proyecto real.
La prioridad es que la arquitectura **tenga sentido**, no que siga una moda.

#### La estructura final debe dejar claro:

* qué es dominio
* qué es caso de uso
* qué es componente de feature
* qué es componente reusable de UI
* qué es infraestructura
* qué es contrato
