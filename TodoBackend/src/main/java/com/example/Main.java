package com.example;

import com.example.config.ConnectDb;
import com.example.entity.TodoEntity;
import com.example.repository.TodoRepository;
import com.example.service.TodoService;
import io.javalin.Javalin;
import org.flywaydb.core.Flyway;

import java.sql.SQLException;
import java.util.Map;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
    public static void main(String[] args) throws SQLException {
        Flyway flyway = Flyway.configure()
                .dataSource(System.getenv("DB_URL"), System.getenv("DB_USERNAME"), System.getenv("DB_PASSWORD"))
                .load();
        flyway.migrate();

        var dsl = ConnectDb.getDSL();
        TodoRepository repository = new TodoRepository(dsl);
        TodoService service = new TodoService(repository);

        Javalin app = Javalin.create(config -> {
            config.bundledPlugins.enableCors(cors -> {
                cors.addRule(it -> {
                    it.allowHost("http://localhost:63342");
                });
            });
        }).start(8081);

        app.get("/todo", ctx -> ctx.json(service.getAll()));

        app.get("/todo/{id}", ctx -> {
           long id = Long.parseLong(ctx.pathParam("id"));
           ctx.json(service.getById(id));
        });

        app.post("/todo", ctx -> {
            Map<String, Object> body = ctx.bodyAsClass(Map.class);
            String title = (String) body.get("title");

            TodoEntity entity = service.add(title);
            ctx.json((entity));
        });

        app.patch("/todo/{id}", ctx -> {
            Long id = Long.parseLong(ctx.pathParam("id"));
            Map<String, Object> update = ctx.bodyAsClass(Map.class);
            ctx.json(service.patch(id, update));
        });

        app.delete("/todo/{id}", ctx -> {
            Long id = Long.parseLong(ctx.pathParam("id"));
            service.delete(id);
            ctx.result("Deleted");
        });
    }
}