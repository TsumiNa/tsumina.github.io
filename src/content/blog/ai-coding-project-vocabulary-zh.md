---
title: AI coding 项目入门：从脚本、框架到抽象边界
description: 以一个 Python 命令行项目为线索，解释真实开发中的项目结构、framework、scaffold、factory、抽象、ABC、Protocol，以及测试、构建和 CI 分别解决什么问题。
published: 2026-09-28
lang: zh
tags: [ai-coding, python, software-engineering]
category: tutorial
draft: true
translationKey: ai-coding-project-vocabulary
---

会写几段 Python，不等于能把一个想法做成可维护的项目。两者之间缺少的往往不是更多语法，而是一套用来描述项目的词汇：入口在哪里，依赖由谁管理，framework 和 library 有什么区别，scaffold 生成了什么，为什么这里需要抽象，以及某个接口应当写成 ABC 还是 Protocol。

在 AI coding 中，这些词更重要了。AI 可以很快生成代码，但它也会把不合适的框架、过早的抽象和看似专业的目录结构一起生成出来。如果我们不能判断这些概念解决了什么问题，就只能用“能不能跑”评价结果。本章的目标不是背定义，而是建立一张项目地图：看到一个陌生仓库时，知道每一部分为什么存在；让 AI 修改项目时，知道该约束什么、验证什么。

## 先定义一个真实但足够小的项目

本系列不会从变量、循环和类依次讲起。我们先做一个能交付的工具，再在需要时补齐知识。

贯穿本章的项目叫 `paper-digest`。它读取一份论文清单 `papers.csv`，检查必填字段，按年份和主题分组，最后生成 `report.md`：

```console
$ paper-digest build data/papers.csv --output report.md
Loaded 42 papers
Wrote report.md
```

这两行输出不是完整的需求。真实项目至少还需要说明四件事：

1. **输入与输出**：CSV 至少包含 `title`、`year` 和 `topic`；输出是确定性的 Markdown，同一输入应产生同一结果。
2. **失败方式**：年份无法解析时，程序以非零状态退出，并指出行号和字段名。
3. **验收条件**：正常样例、空文件和错误年份都有自动化测试；README 给出一条从安装到生成报告的可复制命令。
4. **非目标**：第一版不做网页界面、数据库、云端部署或 LLM 摘要。

这里已经出现了三个常用词。**需求（requirement）**描述系统应当做什么；**范围（scope）**划定这次做什么和不做什么；**验收条件（acceptance criteria）**把“完成”改写成可以观察或检查的结果。向 AI 说“做一个论文管理工具”只有愿望，没有边界。把上面四点一起给它，才是在描述一个项目。

## 从一个文件到一个项目

如果所有逻辑都写在 `digest.py` 中，它仍然可以工作。脚本和项目的区别不在行数，也不在目录是否“专业”，而在于项目需要让多人、多次、在不同机器上可靠地完成开发、运行和验证。

一个可能的最小结构如下：

```text
paper-digest/
├── pyproject.toml
├── README.md
├── src/
│   └── paper_digest/
│       ├── __init__.py
│       ├── cli.py
│       ├── models.py
│       ├── sources.py
│       └── report.py
└── tests/
    ├── test_sources.py
    └── test_report.py
```

先不要把这棵目录树当成标准答案。每个名字都应当对应一个具体责任：

- **repository（仓库，常简称 repo）**是由版本控制系统管理的工作区，通常包含源代码、测试、配置和文档。它是协作与历史记录的边界。
- **project（项目）**是为了一个目标组织起来的全部工作。一个项目通常有一个仓库，但两者不是同义词；单个仓库也可以容纳多个可发布项目。
- **module（模块）**在 Python 的常见情形下是一个可导入的 `.py` 文件，例如 `report.py`。Python 官方教程将模块定义为包含 Python 定义与语句的文件。[^python-modules]
- **package（包）**组织模块并提供导入命名空间，这里是 `paper_digest/`。不要把它与安装包文件混为一谈：日常交流中的 package 也可能指从 PyPI 安装的发行物，必须看上下文。
- **entry point（入口）**是外部世界进入程序的位置。用户运行 `paper-digest` 后，入口负责解析参数、调用业务逻辑，并把结果转换成终端输出和退出状态。
- **configuration（配置）**是无需改动业务代码就能改变的项目参数。Python 项目常用 `pyproject.toml` 声明构建方式、项目元数据、依赖和工具设置。[^pyproject]

目录拆分也不是抽象竞赛。`cli.py` 隔离命令行交互，`sources.py` 负责读取数据，`report.py` 负责生成报告；这样的边界让测试可以绕过终端，直接验证数据处理。如果一个文件只有三行转发代码，又没有独立变化的理由，就不必为了“分层”而拆开。

### 运行时、环境和依赖不是一回事

**runtime（运行时）**是程序执行时所依赖的语言实现和运行机制。对这个项目而言，最直接的运行时是某个具体版本的 Python 解释器。

**dependency（依赖）**是项目调用、但不由项目自身实现的软件。例如使用第三方库解析复杂格式时，该库就是依赖。依赖名称和允许版本应被项目记录，而不是只存在于开发者电脑里。

**virtual environment（虚拟环境）**为项目提供相对隔离的 Python 与已安装包集合。它解决的是“项目 A 需要某个版本、项目 B 需要另一个版本”的冲突，不是虚拟机或容器。Python 文档将其描述为针对特定应用安装包的半隔离环境。[^venv]

**lock file（锁文件）**进一步记录解析后的确切依赖版本，使不同机器更容易重现同一组安装结果。[^lock-file] 它和 `pyproject.toml` 分工不同：前者偏向“这次实际解出了什么”，后者偏向“这个项目允许和需要什么”。不同工具对锁文件的支持和格式不同，所以进入仓库后应先读取现有配置，而不是让 AI 随意更换包管理器。

## Library、framework 和 scaffold 位于不同层面

这三个词经常同时出现在项目初始化阶段，但它们回答的是不同问题。

### Library：你的代码调用它

**library（库）**提供可以调用的函数、类或模块。程序的主要流程仍由你的代码决定。例如 `paper-digest` 可以调用 Python 标准库的 `csv` 读取文件：

```python
import csv

with open("papers.csv", newline="", encoding="utf-8") as file:
    rows = list(csv.DictReader(file))
```

是我们的代码决定何时打开文件、何时调用 `csv.DictReader`，以及下一步做什么。

### Framework：它在预定位置调用你的代码

**framework（框架）**不仅提供功能，还规定应用的主要结构或生命周期。你把自己的代码放进它预留的入口，运行时由框架在合适的时机调用。Martin Fowler 把这种“框架调用应用代码”的控制反转视为框架区别于普通库的重要特征。[^ioc]

例如在 Web 框架中，我们通常声明“当收到某个路径的请求时运行这个函数”。监听端口、解析请求、选择路由和生成响应的总体流程由框架掌握。判断一个工具是不是 framework，可以先问：**主循环由谁拥有，谁调用谁？** 这不是严格分类的唯一标准，但比“体积大的是框架、体积小的是库”可靠。

`paper-digest` 第一版只是一次读取、转换和写出，没有必须交给框架管理的生命周期。使用标准库或几个小型库已经足够。让 AI “用一个现代框架搭起来”并不会自动提高工程质量，反而可能增加概念和依赖。

### Scaffold：生成后留给你的起始结构

**scaffold（脚手架）**是工具根据模板生成的一组初始文件和目录。Cookiecutter 就把自己描述为从项目模板创建项目的工具。[^cookiecutter] 脚手架可能生成 `pyproject.toml`、包目录、测试目录、CI 配置和占位 README。

脚手架工具通常在项目创建时运行；生成的结果随后归项目所有。框架则通常在应用运行时继续参与控制流程。因此，“用 FastAPI 作为 framework”和“用某个模板 scaffold 一个 FastAPI 项目”是两件事。

还会遇到两个邻近词：**template（模板）**是生成时使用的蓝图；**boilerplate（样板代码）**是不同项目中反复出现、变化很少的必要文本。scaffold 可以从 template 生成 boilerplate，但三者不能互换。

## Factory 解决对象创建，不负责搭项目

软件设计中更常见的固定术语是 **factory（工厂）**、**Factory Method（工厂方法）**或 **Factory pattern（工厂模式）**。如果文档或对话里出现 “factory mode”，应先确认它是不是某个工具自己的模式名称，或者只是把 Factory Method 写错了。

假设 `paper-digest` 后来同时支持 CSV 和 JSON。入口可以到处写 `if` 来选择读取器，也可以把创建对象的决定集中起来：

```python
from pathlib import Path


def make_source(path: Path) -> "PaperSource":
    match path.suffix.lower():
        case ".csv":
            return CsvPaperSource()
        case ".json":
            return JsonPaperSource()
        case suffix:
            raise ValueError(f"Unsupported input format: {suffix}")
```

这段 `make_source()` 是一个简单的 factory function：调用方只表达“为这个路径创建数据源”，具体类的选择集中在一个位置。严格意义上的 Factory Method 设计模式通常还包含一个可由子类改写的创建方法。[^factory-method] Python 中先用函数往往就够了；除非继承关系真的提供了变化点，不必让 AI 为了套用模式再制造一组 factory class。

因此，framework、scaffold 和 factory 不处于同一个分类轴上：

| 概念      | 它决定什么                   | 主要发生在何时       | 在示例项目中的可能形式            |
| --------- | ---------------------------- | -------------------- | --------------------------------- |
| framework | 应用的骨架、生命周期和扩展点 | 程序运行时           | 第一版不需要                      |
| scaffold  | 项目最初有哪些文件和配置     | 创建或扩展项目时     | 生成 `src/`、`tests/` 和配置文件  |
| factory   | 这次应创建哪个具体对象       | 程序运行或组装对象时 | 根据扩展名创建 CSV 或 JSON 数据源 |

## 抽象不是把代码写得更绕

**abstraction（抽象）**隐藏一部分实现细节，同时保留调用方真正需要的契约。它的价值不是减少行数，也不是让代码看起来像教材，而是把变化限制在边界的一侧。

在只有 CSV 一种输入时，直接写 `load_csv()` 最清楚。第二种输入格式出现后，报告生成逻辑如果只需要“一组论文”，就不应同时知道 CSV 列名、JSON 键和文件打开方式。此时可以定义“数据源能够加载论文”这个抽象，把格式差异留在各自实现中。

抽象是否值得加入，可以连续问三个问题：

1. 已经出现了两个真实实现，还是只在想象未来可能出现什么？
2. 调用方能否只依赖一个更小、更稳定的行为集合？
3. 隔离后，测试或替换实现是否明显更容易？

如果三个答案都是否，保持具体代码通常更好。AI 很容易根据文件名或一句“保持可扩展”生成 repository、service、manager、adapter 和 factory 多层结构。每一层都应能说出它隔离了哪一种真实变化，否则它只是多了一次跳转。

## ABC 和 Protocol：两种不同的契约

Python 中，Abstract Base Class（抽象基类，ABC）和 `typing.Protocol` 都能表达“一个对象应当提供哪些操作”，但它们表达的关系不同。

下面的代码只展示接口关系，省略了 CSV 解析和 Markdown 渲染；它是结构示意，并不是本章交付的完整可运行项目。

```python
from dataclasses import dataclass
from pathlib import Path
from typing import Protocol


@dataclass(frozen=True)
class Paper:
    title: str
    year: int
    topic: str


class PaperSource(Protocol):
    def load(self, path: Path) -> list[Paper]: ...


class CsvPaperSource:
    def load(self, path: Path) -> list[Paper]:
        # 实际项目在这里解析并验证 CSV。
        return []


def build_report(source: PaperSource, path: Path) -> str:
    papers = source.load(path)
    return f"# Paper digest\n\nTotal: {len(papers)}\n"
```

`CsvPaperSource` 没有继承 `PaperSource`，但它提供了签名兼容的 `load()`，所以静态类型检查器可以把它视为满足该协议。这叫 **structural subtyping（结构化子类型）**：关心对象“具有什么结构和行为”，而不是它“声明自己属于哪个家族”。PEP 544 将 Protocol 定义为对这种静态 duck typing 的支持。[^pep544]

ABC 的常见写法则要求实现类显式继承：

```python
from abc import ABC, abstractmethod
from pathlib import Path


class PaperSource(ABC):
    @abstractmethod
    def load(self, path: Path) -> list[Paper]:
        """Load and validate papers from a path."""


class CsvPaperSource(PaperSource):
    def load(self, path: Path) -> list[Paper]:
        return []
```

如果子类没有实现所有 abstract method，Python 会在运行时阻止其实例化。[^abc] ABC 还可以提供共享的具体方法、属性和受控的继承层次。因此，两者的常见选择可以概括为：

| 判断点             | Protocol               | ABC                                      |
| ------------------ | ---------------------- | ---------------------------------------- |
| 关系               | 结构化：方法匹配即可   | 名义化：通常显式继承                     |
| 主要检查位置       | 静态类型检查器         | 继承关系与运行时实例化检查               |
| 接入已有或第三方类 | 容易，无需修改原类     | 通常需要继承、包装或注册                 |
| 共享实现           | 不是首要用途           | 可以自然承载模板方法和共享行为           |
| 适合的边界         | 调用方只关心一小组能力 | 框架拥有一组实现并要求明确的共同生命周期 |

这张表描述的是常见用法，不是 Python 能力的绝对边界：ABC 也支持注册 virtual subclass 和定制 `__subclasshook__()`，Protocol 也可以显式继承。对 `paper-digest` 而言，如果报告生成器只要求任何对象提供 `load()`，Protocol 更轻；如果项目要统一管理数据源的打开、关闭、缓存和错误处理，并提供共享实现，ABC 可能更合适。

还有一个常见误区：ABC 和 Protocol 不会自动带来“解耦”。如果接口把 CSV 的列名、文件句柄和解析选项全部暴露给报告生成器，双方仍然紧密耦合。真正重要的是契约是否足够小，并且是否使用业务需要的数据表达，例如 `list[Paper]`。

## 工具链把“我这里能跑”变成可重复结果

项目根目录里的工具和配置并不是附属品。它们把人的约定变成机器可以重复执行的检查。

### 版本控制：repository、commit、branch 和 pull request

Git 记录文件历史。一次 **commit** 是带说明的项目快照；**branch** 是一条可独立推进的提交线；**pull request（PR）**是在托管平台上提出并审查一组变更的协作对象，不是 Git 语言本身的命令。

对 AI coding 而言，小而聚焦的 commit 很重要。它使我们能看到 AI 实际改了什么、单独回退错误变更，并把“加入 JSON 输入”和“顺手重写整个架构”区分开。

### Formatter、linter、type checker 和 test

这些检查有重叠，但问题不同：

- **formatter** 自动统一代码外观，例如缩进、换行和引号风格；它不证明逻辑正确。
- **linter** 根据规则发现可疑或不一致的代码，例如未使用的导入、覆盖内置名称或某些容易出错的写法。
- **type checker** 静态检查类型关系，例如传给 `build_report()` 的对象是否满足 `PaperSource`。
- **test** 运行代码并比较实际行为与预期。pytest 的基本形式就是用 `assert` 表达期望。[^pytest]

测试也不是“跑过一次就算有”。`paper-digest` 至少要固定三个行为：有效 CSV 产生预期分组；空 CSV 产生合法空报告；非法年份给出带行号的错误。它们对应前面写下的验收条件。

### Build、package 和 deploy

这三个词描述交付链上的不同动作：

- **build（构建）**把源文件和元数据转换成可分发或可运行的产物。纯 Python 项目不一定需要传统意义上的编译，但仍可能构建 wheel 和 source distribution。Python Packaging User Guide 展示的构建结果正是 `.whl` 和 `.tar.gz`。[^packaging]
- **package / distribution（打包或发行物）**是可以安装或分发的产物。这里再次说明：它与源码中的 Python package 相关，但不是同一个层面的概念。
- **deploy（部署）**把应用或产物放到目标环境并使其可用。一个只在本机运行的 CLI 可以打包而不部署；Web 服务通常还需要部署到服务器或平台。

**CI（continuous integration，持续集成）**则是在提交或 PR 等事件发生时，由远程环境自动执行格式、类型、测试、构建等命令。CI 不是另一套神秘测试；它的关键价值是让仓库规定的检查离开开发者电脑后仍能重复执行。

并非每个项目都需要上述所有工具。第一版可以很小，但必须能回答：安装命令是什么，运行入口是什么，验证命令是什么，最终交付物是什么。

## 在 vibe coding 中怎样使用这套词汇

所谓 vibe coding，不应等于把目标说得很模糊，然后接受一切能运行的输出。更有效的做法是让 AI 负责高速实现和局部探索，而由人明确边界、识别架构选择并掌握验收。

与其发送：

> 帮我写一个专业、可扩展的论文管理程序。

不如发送一份小型任务说明：

```text
Context:
- Existing Python CLI project using a src layout.
- pyproject.toml is the source of dependency and tool configuration.

Goal:
- Add CSV input and generate a Markdown report grouped by year and topic.

Constraints:
- Keep the CLI thin; parsing must not depend on terminal I/O.
- Do not add a web framework, database, plugin system, or factory class.
- Introduce an abstraction only if a second concrete implementation needs it.

Acceptance:
- Valid, empty, and invalid-year CSV cases are covered by tests.
- Errors include the row number and field name.
- Document the exact install, run, and test commands.

Verification:
- Run the repository's formatter, type checker, and focused tests.
- Summarize changed files and any unverified assumption.
```

这份提示没有规定每一行代码，却规定了项目边界。AI 如果建议增加 framework，我们可以问它需要管理哪一种生命周期；如果生成 scaffold，我们可以逐个确认哪些文件服务于当前需求；如果加入 factory 或 ABC，我们可以要求它指出第二个真实实现和变化边界；如果声称完成，我们可以检查验收条件和命令输出。

还有一条实用规则：**不要让同一个提示同时完成探索、架构迁移和大量实现。** 先让 AI 读取仓库并复述入口、依赖、检查命令和现有约定；再让它提出最小变更；确认后实施；最后根据 diff 和测试结果验收。步骤变小以后，“vibe”并没有消失，只是被可恢复的反馈循环包围起来。

## 本章检查点

现在回到最初的 `paper-digest`。完成本章后，应当能够不看代码回答以下问题：

1. 用户从哪个 entry point 进入程序，程序的输入、输出和失败方式是什么？
2. 哪些文件是 Python module，哪个目录是 Python package，仓库配置在哪里？
3. 项目使用了 library 还是 framework？如果使用 framework，谁控制主要流程？
4. 哪些文件来自 scaffold？生成后哪些保留，哪些只是无用 boilerplate？
5. 当前是否已经有值得隔离的真实变化？Protocol、ABC 或一个具体函数中，哪个是最小充分方案？
6. formatter、linter、type checker 和 test 分别验证什么？
7. build 的产物是什么，是否真的需要 deploy，CI 会重复哪些本地命令？

如果这些问题没有答案，继续让 AI 增加功能只会扩大未知区域。相反，只要能画出这张项目地图，即使还记不住某个 Python API，也已经可以查文档、提出精确问题，并判断生成的代码是否属于这个项目。

下一章将以这个最小范围为起点，真正建立 `paper-digest` 仓库：先把需求写成可执行的验收条件，再生成第一个能安装、运行和测试的垂直切片。

[^python-modules]: Python documentation, [Modules](https://docs.python.org/3/tutorial/modules.html).

[^pyproject]: Python Packaging User Guide, [Writing your `pyproject.toml`](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/).

[^venv]: Python documentation, [Installing Python Modules: Key terms](https://docs.python.org/3/installing/index.html#key-terms).

[^lock-file]: Python Packaging User Guide, [Tool recommendations](https://packaging.python.org/en/latest/guides/tool-recommendations/).

[^ioc]: Martin Fowler, [Inversion of Control](https://martinfowler.com/bliki/InversionOfControl.html).

[^cookiecutter]: Cookiecutter documentation, [Cookiecutter: Better Project Templates](https://cookiecutter.readthedocs.io/).

[^factory-method]: Real Python, [The Factory Method Pattern and Its Implementation in Python](https://realpython.com/factory-method-python/).

[^pep544]: Python Enhancement Proposals, [PEP 544 — Protocols: Structural subtyping](https://peps.python.org/pep-0544/).

[^abc]: Python documentation, [`abc` — Abstract Base Classes](https://docs.python.org/3/library/abc.html).

[^pytest]: pytest documentation, [Get Started](https://docs.pytest.org/en/stable/getting-started.html).

[^packaging]: Python Packaging User Guide, [Packaging Python Projects](https://packaging.python.org/en/latest/tutorials/packaging-projects/).
