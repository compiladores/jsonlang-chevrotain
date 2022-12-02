# Compiladores - TP final 2c 2022

### Instalación

Ejecutar el siguiente comando.

```
make setup
```

### Ejecución de tests

Pueden ejecutarse los tests desde la herramienta de testing de Visual Studio Code, o corriendo este comando:

```
./deno test
```

### ¿Cómo agregaste soporte para strings?

El soporte para strings fue bastante sencillo de agregar en la grámatica. Consistió unicamente en agregar un token StringLiteral al lexer que detecte palabras entre comillas dobles:

```
export const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /"(?:""|[^"])*"/,
});
```

Luego se agrego la posibilidad de parsear dichos tokens en la gramatica, como una de las opciones de simpleExpression:

```
  simpleExpression = this.RULE("simpleExpression", () => {
    this.OR([
      ...
      { ALT: () => this.CONSUME(StringLiteral) },
      { ALT: () => this.CONSUME(Identifier) },
      ...
    ]);
  });
```

Por último, para mostrarlo en jsonlang, se modifico el visitor de simpleExpression:

```
  simpleExpression(ctx: SimpleExpressionCstChildren) {
    ...
    if (ctx.Identifier) return ctx.Identifier[0].image;
    if (ctx.StringLiteral)
      return ctx.StringLiteral[0].image.replace(/^"(.*)"$/, "$1");
    ...
  }
```

Resulta entonces la siguiente traduccion de mi lenguaje a jsonlang:

```
<x> = "test";  -->  { set: "x", value: "test" }
```

También, como agregue soporte para TDA y verificación de tipos, restringí algunas operaciones cuando las expresiones contienen strings. Ejemplo: `1 + "test"` no está permitido.

### ¿Cómo agregaste soporte para arrays?

Agregue soporte para arrays de forma similar a los strings. Así resulta el parser tras agregar arrays a la gramatica:

```
  simpleExpression = this.RULE("simpleExpression", () => {
    this.OR([
      ...
      { ALT: () => this.SUBRULE(this.array) },
      ...
    ]);
  });

  array = this.RULE("array", () => {
    this.CONSUME(LBracket);
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.expression),
    });
    this.CONSUME(RBracket);
  });
```

Y asi resulto el visitor:

```
  simpleExpression(ctx: SimpleExpressionCstChildren) {
    ...
    if (ctx.array) return this.visit(ctx.array);
    ...
  }

  array(ctx: ArrayCstChildren) {
    if (!ctx.expression) return [];
    return ctx.expression.map((expr) => this.visit(expr));
  }
```

Resulta entonces la siguiente traduccion de mi lenguaje a jsonlang:

```
<x> = [1, 2, 3];  -->  { set: "x", value: [1, 2, 3] }
```

### ¿Cómo agregaste soporte para diccionarios?

Agregue soporte para diccionarios de forma similar a los arrays. Así resulta el parser tras agregarlos a la gramatica:

```
  simpleExpression = this.RULE("simpleExpression", () => {
    this.OR([
      ...
      { ALT: () => this.SUBRULE(this.dictionary) },
      ...
    ]);
  });

  dictionary = this.RULE("dictionary", () => {
    this.CONSUME(LCurly);
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => {
        this.CONSUME(Identifier);
        this.CONSUME(Colon);
        this.SUBRULE(this.expression);
      },
    });
    this.CONSUME(RCurly);
  });
```

Y asi resulto el visitor:

```
  simpleExpression(ctx: SimpleExpressionCstChildren) {
    ...
    if (ctx.dictionary) return this.visit(ctx.dictionary);
    ...
  }

  dictionary(ctx: DictionaryCstChildren) {
    const retVal: any = { dict: [] };
    if (!ctx.Identifier || !ctx.expression) return retVal;
    for (let i = 0; i < ctx.Identifier.length; i++) {
      const key = ctx.Identifier[i].image;
      const value = this.visit(ctx.expression[i]);
      retVal.dict.push({ [key]: value });
    }
    return retVal;
  }
```

Resulta entonces la siguiente traduccion de mi lenguaje a jsonlang:

```
<x> = { name: "Test", age: 30 }; --> { set: "x", value: { dict: [{ name: "Test" }, { age: 30]} }
```

Ademas, como agregue soporte para TDA y verificación de tipos, agregue funcionalidades para poder determinar si un diccionario es compatible con los campos que espera un TDA (se muestra el código en las próximas secciones).

### ¿Cómo agregaste Verificación de tipos estáticos?

//TODO: terminar

### ¿Cómo agregaste TDA?

Mi idea fue que esta sea la sintaxis para definir un nuevo tipo:

```
<<Person>> = {
  name: string;
  age: number;
}
```

Entonces, necesité ampliar el parser para permitirlo:

```
  typeStatement = this.RULE("typeStatement", () => {
    this.CONSUME(LAngleBracket);
    this.CONSUME2(LAngleBracket);
    this.CONSUME(Identifier);
    this.CONSUME(RAngleBracket);
    this.CONSUME2(RAngleBracket);
    this.CONSUME(LCurly);
    this.AT_LEAST_ONE(() => {
      this.CONSUME2(Identifier);
      this.CONSUME(Colon);
      this.CONSUME3(Identifier);
      this.CONSUME(SemiColon);
    });
    this.CONSUME(RCurly);
  });
```

//TODO: terminar

### Herramienta de Parsing: Chevrotain

[Link a la web de la herramienta](https://chevrotain.io/docs/)

##### ¿Cuán facil fue aprender esta herramienta de parsing? ¿Por qué?

La herramienta me resultó muy sencilla de entender ya que la documentación es muy clara y completa. Pocas veces necesite resolver dudas por fuera de esta documentación, y en estos casos, los ejemplos y las discusiones en el GitHub de la herramienta resultaron muy útiles.

Además, facilita mucho el armado de las diferentes partes del parser.

Por último, que sea una herramienta para Typescript me resulto muy util y me facilito mucho trabajo, dado que este me es muy familiar.

##### ¿Recomendarías esta herramienta de parsing a futuros estudiantes de la materia? ¿Por qué?

La recomendaría totalmente a futuros estudiantes de la materia si se sienten comodos utilizando JS/TS.

El tutorial es clarisimo, y si se juega un poco con los features que ofrece, se pueden lograr de forma muy facil el desarrollo deseado.

##### Liste ventajas y desventajas del uso de esta herramienta de parsing.

Ventajas:

- Documentacion muy clara.
- Facil creacion del Lexer, permitiendo categorias de tokens, facil tratado de whitespaces, y otros features útiles.
- La gramática se escribe con la misma herramienta. No se necesitan dependencias adicionales ni herramientas de generacion de codigo.
- La gramática, al ser escrita en Typescript, es debuggeable.
- El visitor con el que luego se podria implementar semantica (o cualquier otra funcionalidad una vez que se tiene el arbol de sintaxis) puede ser desarrollado por separado, o embebido en el mismo parser.
- Generación automática de diagramas de sintaxis.
- Generación automatica de tipos para el Visitor.

Desventajas:

- No hay muchos mas recursos que la documentación y el GitHub de la herramienta, por lo que si se tiene algun problema cuya solución no se encuentre ahí, se complicará su resolución.
- Los ejemplos estan en Javascript. Si bien soporta Typescript, hay que traducirlo y pueden suceder algunas confusiones.
- La gramática puede quedar mas verbosa que si fuera escrita en, por ejemplo, BNF.
