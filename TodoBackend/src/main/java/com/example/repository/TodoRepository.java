package com.example.repository;

import com.example.entity.TodoEntity;
import org.jooq.DSLContext;

import java.util.List;

import static org.jooq.impl.DSL.field;
import static org.jooq.impl.DSL.table;

public class TodoRepository {
    private final DSLContext dsl;

    public TodoRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    public List<TodoEntity> findAll() {
        return dsl.selectFrom("todo")
                .fetchInto(TodoEntity.class);
    }

    public TodoEntity findById(long id) {
        return dsl.selectFrom("todo")
                .where("id = ?", id)
                .fetchOneInto(TodoEntity.class);
    }

    public TodoEntity save(TodoEntity todoEntity) {
        dsl.insertInto(table("todo"))
                .columns(field("title"),
                        field("completed"))
                .values(todoEntity.getTitle(),
                        todoEntity.getCompleted())
                .execute();

        Long generatedId = dsl.lastID().longValue();
        return findById(generatedId);
    }

    public TodoEntity update(TodoEntity todoEntity) {
        dsl.update(table("todo"))
                .set(field("title"), todoEntity.getTitle())
                .set(field("completed"), todoEntity.getCompleted())
                .where("id = ?", todoEntity.getId())
                .execute();

        return findById(todoEntity.getId());
    }

    public void delete(long id) {
        dsl.deleteFrom(table("todo"))
                .where("id = ?", id)
                .execute();
    }


}
